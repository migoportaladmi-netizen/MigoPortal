import React, { useState } from 'react';
import { Building2, Globe, FileText, MapPin, ArrowRight, Loader2 } from 'lucide-react';

interface OnboardingProps {
    onComplete: (companyData: any) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        website: '',
        taxId: '',
        address: ''
    });

    const generateInviteCode = (companyName: string) => {
        const prefix = companyName.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5);
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `${prefix}-${random}`;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            const inviteCode = generateInviteCode(formData.name);
            onComplete({
                ...formData,
                id: 'comp_' + Math.random().toString(36).substring(2, 9),
                inviteCode,
                subscriptionStatus: 'Active',
                subscriptionPlan: 'Team Starter'
            });
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="absolute inset-0 bg-white dark:bg-slate-900 z-20 p-8 flex flex-col h-full overflow-y-auto">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 rounded-2xl mx-auto flex items-center justify-center mb-4">
                    <Building2 size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Setup Your Company</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                    Complete your onboarding to access the platform.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 flex-1">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Company Name</label>
                    <div className="relative">
                        <Building2 size={18} className="absolute left-3 top-3 text-slate-400" />
                        <input
                            type="text"
                            required
                            placeholder="TechCorp LLC"
                            className="w-full pl-10 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Company Website</label>
                    <div className="relative">
                        <Globe size={18} className="absolute left-3 top-3 text-slate-400" />
                        <input
                            type="url"
                            required
                            placeholder="https://example.com"
                            className="w-full pl-10 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                            value={formData.website}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">TAX ID</label>
                    <div className="relative">
                        <FileText size={18} className="absolute left-3 top-3 text-slate-400" />
                        <input
                            type="text"
                            required
                            placeholder="US-99-887766"
                            className="w-full pl-10 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                            value={formData.taxId}
                            onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Company Address</label>
                    <div className="relative">
                        <MapPin size={18} className="absolute left-3 top-3 text-slate-400" />
                        <textarea
                            required
                            rows={3}
                            placeholder="123 Business Way, Suite 100..."
                            className="w-full pl-10 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-xl shadow-lg transition-all flex justify-center items-center mt-6"
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : (
                        <>
                            Complete Onboarding <ArrowRight className="ml-2" size={20} />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default Onboarding;
