import React from 'react';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen, title, message, confirmText = "Confirm", cancelText = "Cancel", isDestructive = false, onConfirm, onCancel
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200 dark:border-slate-800 scale-100 transition-all">
                <div className="p-6 text-center">
                    <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isDestructive ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'}`}>
                        {isDestructive ? <ShieldAlert size={24} /> : <ShieldCheck size={24} />}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{message}</p>
                </div>
                <div className="flex border-t border-slate-100 dark:border-slate-800">
                    <button onClick={onCancel} className="flex-1 py-3 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        {cancelText}
                    </button>
                    <div className="w-[1px] bg-slate-100 dark:bg-slate-800"></div>
                    <button onClick={onConfirm} className={`flex-1 py-3 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${isDestructive ? 'text-red-600 dark:text-red-400' : 'text-indigo-600 dark:text-indigo-400'}`}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
