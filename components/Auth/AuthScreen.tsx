import React, { useState } from 'react';
import {
    ArrowLeft, UserCog, UserCheck, Building2, User, Mail, Lock, EyeOff, Eye, ShieldCheck, Loader2
} from 'lucide-react';
import { UserProfile, Company } from '../../types';
import { MOCK_USERS } from '../../constants';
import Onboarding from './Onboarding';

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
        firstName: '',
        lastName: '',
        gender: '',
        email: '',
        password: '',
        role: 'Employee',
    });
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [pendingAdminProfile, setPendingAdminProfile] = useState<UserProfile | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("AuthScreen: handleSubmit triggered", { isSignUp, role: formData.role, showOnboarding });
        setIsLoading(true);

        setTimeout(() => {
            const foundUser = availableUsers.find(u => u.email === formData.email);

            if (!isSignUp && !foundUser) {
                alert("Invalid email or password");
                setIsLoading(false);
                return;
            }

            const fullName = isSignUp ? `${formData.firstName} ${formData.lastName}`.trim() : (foundUser ? foundUser.name : 'Unknown User');
            const initials = isSignUp
                ? (formData.firstName && formData.lastName ? formData.firstName[0] + formData.lastName[0] : (formData.firstName ? formData.firstName[0] : 'U'))
                : (foundUser ? foundUser.avatarInitials : 'U');

            let assignedCompanyId: string | undefined = undefined;

            if (isSignUp) {
                if (inviteCode === company.inviteCode) {
                    assignedCompanyId = company.id;
                } else if (inviteCode) {
                    alert("Invalid invite code");
                    setIsLoading(false);
                    return;
                }
            } else {
                assignedCompanyId = foundUser?.companyId;
            }

            if (!isSignUp && formData.password !== 'Test123#') {
                alert("Invalid email or password");
                setIsLoading(false);
                return;
            }



            const userProfile: UserProfile = {
                name: isSignUp ? fullName : (foundUser ? foundUser.name : 'Unknown User'),
                email: formData.email,
                role: isSignUp ? formData.role : (foundUser ? foundUser.role : 'Administrator'),
                phone: foundUser ? foundUser.phone : '',
                gender: isSignUp ? formData.gender : (foundUser ? foundUser.gender : ''),
                avatarInitials: isSignUp ? initials.toUpperCase() : (foundUser ? foundUser.avatarInitials : 'U'),
                companyId: assignedCompanyId,
                status: 'Active',
                employment: foundUser?.employment,
                budget: foundUser?.budget,
                compensation: foundUser?.compensation,
                emergencyContact: foundUser?.emergencyContact,
                documents: foundUser?.documents || []
            };

            console.log("AuthScreen: userProfile generated", userProfile);

            if (isSignUp && formData.role === 'Administrator' && !showOnboarding) {
                console.log("AuthScreen: Proceeding to onboarding");
                setPendingAdminProfile(userProfile);
                setShowOnboarding(true);
                setIsLoading(false);
                return;
            }

            console.log("AuthScreen: Completing login", userProfile);
            onLogin(isSignUp ? userProfile : (foundUser as UserProfile));
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
        <div className="min-h-dvh flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors duration-300 relative">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-fade-in relative min-h-[500px]">
                {showOnboarding ? (
                    <Onboarding
                        onComplete={(companyData) => {
                            console.log("AuthScreen: Onboarding complete", companyData);
                            // Collect onboarding data and complete login
                            const finalProfile = {
                                ...pendingAdminProfile,
                                companyId: companyData.id,
                                onboardingData: companyData
                            } as UserProfile;

                            console.log("AuthScreen: Calling onLogin with finalProfile", finalProfile);
                            onLogin(finalProfile);
                        }}
                    />
                ) : (
                    <>
                        <button
                            onClick={onBack}
                            className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>

                        <div className="p-8 pb-0 text-center">
                            <button
                                onClick={onBack}
                                className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none mb-6 hover:opacity-90 transition-opacity"
                            >
                                <span className="text-white text-3xl font-bold">M</span>
                            </button>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                                {isSignUp ? 'Create Account' : 'Welcome Back'}
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                                {isSignUp ? 'Join MigoPortal for smart HR, Recruitment and Payroll management' : 'Sign in to manage your HR, Recruitment & Payroll Platform'}
                            </p>
                        </div>



                        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
                            {isSignUp && formData.role === 'Employee' && (
                                <div className="space-y-2 animate-fade-in">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Company Invite Code <span className="text-slate-400 text-xs font-normal ml-1">(Optional)</span></label>
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
                                    <p className="text-xs text-slate-400">Ask your admin for the code</p>
                                </div>
                            )}

                            {isSignUp && (
                                <>
                                    <div className="grid grid-cols-2 gap-4 animate-fade-in">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">First Name</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="John"
                                                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                                                value={formData.firstName}
                                                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Last Name</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Doe"
                                                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                                                value={formData.lastName}
                                                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2 animate-fade-in">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Gender</label>
                                        <select
                                            required
                                            className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                                            value={formData.gender}
                                            onChange={e => setFormData({ ...formData, gender: e.target.value })}
                                        >
                                            <option value="" disabled>Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                            <option value="Prefer not to say">Prefer not to say</option>
                                        </select>
                                    </div>
                                </>
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
                                            onClick={() => setFormData({ ...formData, role: 'Employee' })}
                                            className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all
                      ${formData.role === 'Employee'
                                                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/20 dark:border-indigo-400 dark:text-indigo-300'
                                                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'}
                    `}
                                        >
                                            <User size={24} />
                                            <span className="text-xs font-semibold">Employee</span>
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
                    </>
                )}
            </div>
        </div>
    );
};

export default AuthScreen;
