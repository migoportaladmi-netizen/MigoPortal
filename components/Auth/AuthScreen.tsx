import React, { useState } from 'react';
import {
    ArrowLeft, UserCog, UserCheck, Building2, User, Mail, Lock, EyeOff, Eye, ShieldCheck, Loader2
} from 'lucide-react';
import { UserProfile, Company } from '../../types';
import { MOCK_USERS } from '../../constants';

interface AuthScreenProps {
    onLogin: (user: UserProfile) => void;
    onBack: () => void;
    availableUsers: UserProfile[];
    company: Company;
    initialIsSignUp?: boolean;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, onBack, availableUsers, company, initialIsSignUp = false }) => {
    const [isSignUp, setIsSignUp] = useState(initialIsSignUp);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [inviteCode, setInviteCode] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'User',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            const parts = (isSignUp ? formData.name : 'John Doe').split(' ');
            const initials = parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0][0];

            let assignedCompanyId: string | undefined = undefined;

            if (isSignUp) {
                if (inviteCode === company.inviteCode) {
                    assignedCompanyId = company.id;
                } else if (inviteCode) {
                    alert("Invalid invite code");
                    setIsLoading(false);
                    return;
                }
            }

            const userProfile: UserProfile = {
                name: isSignUp ? formData.name : 'John Doe',
                email: formData.email,
                role: isSignUp ? formData.role : 'Administrator',
                phone: '',
                avatarInitials: initials.toUpperCase(),
                companyId: isSignUp ? assignedCompanyId : availableUsers.find(u => u.email === formData.email)?.companyId,
                status: 'Active'
            };

            onLogin(userProfile);
            setIsLoading(false);
        }, 1500);
    };

    const handleQuickLogin = (email: string) => {
        setIsLoading(true);
        const foundUser = availableUsers.find(u => u.email === email);

        setTimeout(() => {
            if (foundUser) {
                onLogin(foundUser);
            } else {
                onLogin(MOCK_USERS[0]);
            }
            setIsLoading(false);
        }, 800);
    };

    return (
        <div className="min-h-dvh flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors duration-300">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-fade-in relative">
                <button
                    onClick={onBack}
                    className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>

                <div className="p-8 pb-0 text-center">
                    <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none mb-6">
                        <span className="text-white text-3xl font-bold">M</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {isSignUp ? 'Create Account' : 'Welcome Back'}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                        {isSignUp ? 'Join MigoPortal for smart expense management' : 'Sign in to manage your LLC travel & expenses'}
                    </p>
                </div>

                <div className="px-8 mt-6">
                    <p className="text-xs font-semibold text-slate-400 text-center mb-3 uppercase tracking-wider">Quick Demo Login</p>
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => handleQuickLogin('admin@migoportal.com')} className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900 rounded-xl text-xs font-bold hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors flex flex-col items-center">
                            <UserCog size={20} className="mb-1" />
                            Login as Admin
                        </button>
                        <button onClick={() => handleQuickLogin('bob@migoportal.com')} className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900 rounded-xl text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors flex flex-col items-center">
                            <UserCheck size={20} className="mb-1" />
                            Login as User
                        </button>
                    </div>
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800"></div></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-slate-900 px-2 text-slate-400">Or continue with email</span></div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
                    {isSignUp && (
                        <div className="space-y-2 animate-fade-in">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Company Invite Code (Optional)</label>
                            <div className="relative">
                                <Building2 size={18} className="absolute left-3 top-3 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Enter code (e.g. TECH-2024)"
                                    className="w-full pl-10 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                                    value={inviteCode}
                                    onChange={e => setInviteCode(e.target.value)}
                                />
                            </div>
                            <p className="text-xs text-slate-400">Use code <b>{company.inviteCode}</b> to join {company.name}</p>
                        </div>
                    )}

                    {isSignUp && (
                        <div className="space-y-2 animate-fade-in">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                            <div className="relative">
                                <User size={18} className="absolute left-3 top-3 text-slate-400" />
                                <input
                                    type="text"
                                    required
                                    placeholder="John Doe"
                                    className="w-full pl-10 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-3 top-3 text-slate-400" />
                            <input
                                type="email"
                                required
                                placeholder="you@company.com"
                                className="w-full pl-10 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                        <div className="relative">
                            <Lock size={18} className="absolute left-3 top-3 text-slate-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="••••••••"
                                className="w-full pl-10 pr-10 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {isSignUp && (
                        <div className="space-y-2 animate-fade-in">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Account Type</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'User' })}
                                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all
                      ${formData.role === 'User'
                                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/20 dark:border-indigo-400 dark:text-indigo-300'
                                            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'}
                    `}
                                >
                                    <User size={24} />
                                    <span className="text-xs font-semibold">Normal User</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'Administrator' })}
                                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all
                      ${formData.role === 'Administrator'
                                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/20 dark:border-indigo-400 dark:text-indigo-300'
                                            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'}
                    `}
                                >
                                    <ShieldCheck size={24} />
                                    <span className="text-xs font-semibold">Administrator</span>
                                </button>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 transition-all flex justify-center items-center"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : (isSignUp ? 'Create Account' : 'Sign In')}
                    </button>

                    <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                        {isSignUp ? 'Already have an account?' : 'Don\'t have an account?'}
                        <button
                            type="button"
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="ml-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                        >
                            {isSignUp ? 'Log in' : 'Sign up'}
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default AuthScreen;
