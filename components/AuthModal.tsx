import React, { useState, useEffect } from 'react';
import { X, User, Building2, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { User as UserType } from '../types';
import { MOCK_USERS } from '../constants';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: 'applicant' | 'employer'; // Mapped to User 'Administrator' or 'User' role in this demo context
  onLogin: (user: UserType) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialRole = 'applicant', onLogin }) => {
  const [role, setRole] = useState<'applicant' | 'employer'>(initialRole);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setRole(initialRole);
      setMode('login');
      setEmail('');
      setPassword('');
      setError('');
    }
  }, [isOpen, initialRole]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // For signup demo
    if (mode === 'signup') {
        const newUser: UserType = {
            name: role === 'employer' ? 'New Company' : 'New User',
            email,
            role: role === 'employer' ? 'Administrator' : 'User',
            phone: '',
            avatarInitials: 'NU',
            company: role === 'employer' ? 'New Company' : undefined
        };
        onLogin(newUser);
        onClose();
        return;
    }

    // Login Logic
    // For demo purposes, we ignore the password check since MOCK_USERS don't have passwords
    const foundUser = MOCK_USERS.find(u => u.email === email);
    
    if (foundUser) {
        // Validate role roughly based on what MigoPortal roles are ('Administrator' vs 'User')
        const intendedUserRole = role === 'employer' ? 'Administrator' : 'User';
        
        // Simple check: if trying to login as employer, must be admin. If applicant, can be user.
        // Or just allow login and let the main app handle permissions.
        
        onLogin(foundUser);
        onClose();
    } else {
        // Allow demo login with hardcoded credentials if not in mock list
        if (password === 'password') {
             // Fake a user
             const fakeUser: UserType = {
                 name: 'Demo User',
                 email: email,
                 role: role === 'employer' ? 'Administrator' : 'User',
                 phone: '555-0000',
                 avatarInitials: 'DU',
                 company: role === 'employer' ? 'Demo Corp' : undefined
             };
             onLogin(fakeUser);
             onClose();
        } else {
             setError('Invalid email or password. Try using a demo account from the list or password "password".');
        }
    }
  };

  const fillDemoCreds = () => {
     if (role === 'applicant') {
         setEmail('bob@migoportal.com');
         setPassword('password');
     } else {
         setEmail('admin@migoportal.com');
         setPassword('password');
     }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" 
          onClick={onClose}
        ></div>
        
        {/* Modal */}
        <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
            {/* Header / Role Selection */}
            <div className="p-6 pb-0">
                <button 
                  onClick={onClose} 
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
                
                <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
                    {mode === 'login' ? 'Welcome Back' : 'Join MigoPortal'}
                </h2>
                <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-6">
                   {mode === 'login' ? 'Sign in to access your dashboard' : 'Create an account to get started'}
                </p>

                <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl mb-6">
                    <button 
                        onClick={() => setRole('applicant')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${role === 'applicant' ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                    >
                        <User className="w-4 h-4" /> Employee
                    </button>
                    <button 
                         onClick={() => setRole('employer')}
                         className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${role === 'employer' ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                    >
                        <Building2 className="w-4 h-4" /> Admin
                    </button>
                </div>
            </div>

            {/* Form */}
            <div className="px-6 pb-6 overflow-y-auto custom-scrollbar">
                {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 text-sm rounded-lg flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {mode === 'signup' && (
                        <div>
                             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {role === 'applicant' ? 'Full Name' : 'Company Name'}
                             </label>
                             <input 
                                type="text" 
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors" 
                                placeholder={role === 'applicant' ? "John Doe" : "Tech Corp Inc."} 
                                required
                             />
                        </div>
                    )}
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <input 
                                type="email" 
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors" 
                                placeholder="you@example.com" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                         <div className="relative">
                            <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <input 
                                type="password" 
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors" 
                                placeholder="••••••••" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    
                    {mode === 'login' && (
                        <div className="flex justify-between items-center">
                            <button type="button" onClick={fillDemoCreds} className="text-xs text-gray-500 hover:text-indigo-500 underline">
                                Fill Demo Credentials
                            </button>
                            <a href="#" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">Forgot password?</a>
                        </div>
                    )}

                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-bold transition-all shadow-lg shadow-indigo-200 dark:shadow-none mt-2 flex items-center justify-center gap-2">
                        {mode === 'login' ? 'Sign In' : 'Create Account'}
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                        <button 
                            onClick={() => {
                                setMode(mode === 'login' ? 'signup' : 'login');
                                setError('');
                            }}
                            className="ml-1 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                        >
                            {mode === 'login' ? 'Sign Up' : 'Log In'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default AuthModal;