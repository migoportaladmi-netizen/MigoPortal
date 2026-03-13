import React, { useState } from 'react';
import { CreditCard, CheckCircle2, Building2, ShieldCheck, Loader2, ArrowLeft } from 'lucide-react';

interface PaymentGateProps {
    onPaymentSuccess: () => void;
    onCancel: () => void;
}

const PaymentGate: React.FC<PaymentGateProps> = ({ onPaymentSuccess, onCancel }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate payment processing
        setTimeout(() => {
            setIsLoading(false);
            onPaymentSuccess();
        }, 2000);
    };

    return (
        <div className="absolute inset-0 bg-white dark:bg-slate-900 z-10 flex flex-col p-8 pb-10 flex flex-col h-full overflow-y-auto">
            <button
                type="button"
                onClick={onCancel}
                className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
                <ArrowLeft size={20} />
            </button>

            <div className="text-center mt-4">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl mx-auto flex items-center justify-center mb-6">
                    <ShieldCheck size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Subscription</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                    Activate your workspace. Startup plan includes 1 Admin + 1 Employee minimum.
                </p>
            </div>

            <div className="mt-8 bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Starter Plan (2 Users)</span>
                    <span className="text-slate-900 dark:text-white font-bold">$13.98 / mo</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Unlimited Employees</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Full HR & Payroll Suite</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Advanced Analytics</li>
                </ul>
            </div>

            <form onSubmit={handlePayment} className="mt-8 space-y-4 flex-1 flex flex-col justify-end">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Card Information</label>
                    <div className="relative">
                        <CreditCard size={18} className="absolute left-3 top-3 text-slate-400" />
                        <input
                            type="text"
                            required
                            placeholder="0000 0000 0000 0000"
                            className="w-full pl-10 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <input
                            type="text"
                            required
                            placeholder="MM/YY"
                            className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                        />
                        <input
                            type="text"
                            required
                            placeholder="CVC"
                            className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all flex justify-center items-center mt-6"
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Subscribe & Access App'}
                </button>
            </form>
        </div>
    );
};

export default PaymentGate;
