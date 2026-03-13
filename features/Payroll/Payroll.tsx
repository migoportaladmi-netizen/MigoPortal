import React, { useState } from 'react';
import {
    DollarSign,
    Calendar,
    Download,
    FileText,
    CheckCircle2,
    Clock,
    Search,
    Filter,
    Plus,
    ArrowUpRight,
    ArrowDownRight,
    TrendingUp,
    Users,
    ChevronRight,
    MoreVertical,
    ShieldCheck
} from 'lucide-react';
import { PayrollRun, PayStub, UserProfile } from '../../types';

interface PayrollProps {
    user: UserProfile;
    payrollRuns: PayrollRun[];
    setPayrollRuns: React.Dispatch<React.SetStateAction<PayrollRun[]>>;
    payStubs: PayStub[];
    setPayStubs: React.Dispatch<React.SetStateAction<PayStub[]>>;
    allUsers: UserProfile[];
    setAllUsers: React.Dispatch<React.SetStateAction<UserProfile[]>>;
}

const Payroll: React.FC<PayrollProps> = ({ user, payrollRuns, setPayrollRuns, payStubs, setPayStubs, allUsers, setAllUsers }) => {
    const [activeTab, setActiveTab] = useState<'runs' | 'stubs' | 'salaries'>('runs');
    const [isRunPayrollModalOpen, setIsRunPayrollModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('default', { month: 'long', year: 'numeric' }));

    const [isEditSalaryModalOpen, setIsEditSalaryModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
    const [editForm, setEditForm] = useState({
        baseSalary: 0,
        currency: 'USD',
        effectiveDate: new Date().toISOString().split('T')[0]
    });

    const isAdmin = user.role === 'Administrator';

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const handleRunPayroll = () => {
        setIsProcessing(true);

        // Simulate API call
        setTimeout(() => {
            const newRunId = `pr-${Date.now()}`;
            const runDate = new Date().toISOString().split('T')[0];

            let totalGross = 0;
            let totalNet = 0;
            const newStubs: PayStub[] = [];

            allUsers.forEach(u => {
                const baseSalary = u.compensation?.baseSalary || 0;
                const monthlyGross = baseSalary / 12;
                const taxes = monthlyGross * 0.2; // 20% tax
                const deductions = monthlyGross * 0.05; // 5% deductions
                const monthlyNet = monthlyGross - taxes - deductions;

                totalGross += monthlyGross;
                totalNet += monthlyNet;

                newStubs.push({
                    id: `ps-${u.email}-${Date.now()}`,
                    userId: u.email,
                    userName: u.name,
                    period: selectedMonth,
                    payDate: runDate,
                    grossPay: monthlyGross,
                    netPay: monthlyNet,
                    deductions: [{ type: 'Standard Deductions', amount: deductions }],
                    taxes: [{ type: 'Estimated Taxes', amount: taxes }],
                    currency: u.compensation?.currency || 'USD',
                    status: 'Published',
                    companyId: u.companyId || ''
                });
            });

            const newRun: PayrollRun = {
                id: newRunId,
                period: selectedMonth,
                runDate: runDate,
                totalEmployees: allUsers.length,
                totalGross: totalGross,
                totalNet: totalNet,
                status: 'Completed',
                companyId: user.companyId || ''
            };

            setPayrollRuns(prev => [newRun, ...prev]);
            setPayStubs(prev => [...newStubs, ...prev]);
            setIsProcessing(false);
            setIsRunPayrollModalOpen(false);
            setActiveTab('runs');
        }, 2000);
    };

    const handleEditSalary = (u: UserProfile) => {
        setEditingUser(u);
        setEditForm({
            baseSalary: u.compensation?.baseSalary || 0,
            currency: u.compensation?.currency || 'USD',
            effectiveDate: u.compensation?.effectiveDate || new Date().toISOString().split('T')[0]
        });
        setIsEditSalaryModalOpen(true);
    };

    const handleUpdateSalary = () => {
        if (!editingUser) return;

        setAllUsers(prev => prev.map(u => {
            if (u.email === editingUser.email) {
                return {
                    ...u,
                    compensation: {
                        ...u.compensation,
                        baseSalary: Number(editForm.baseSalary),
                        currency: editForm.currency,
                        effectiveDate: editForm.effectiveDate
                    } as any
                };
            }
            return u;
        }));

        setIsEditSalaryModalOpen(false);
        setEditingUser(null);
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const styles: Record<string, string> = {
            Completed: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30',
            Processing: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30',
            Draft: 'bg-slate-50 text-slate-700 border-slate-100 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-900/30',
            Published: 'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-900/30',
        };

        return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles.Draft}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in relative">
            {/* Run Payroll Modal */}
            {isRunPayrollModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 dark:border-slate-800 animate-scale-in">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Run Payroll</h3>
                                    <p className="text-slate-500 dark:text-slate-400 mt-1">Process salaries for all active employees.</p>
                                </div>
                                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                                    <DollarSign size={24} />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                        <Calendar size={18} className="text-indigo-500" />
                                        Payroll Period
                                    </h4>
                                    <select
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                        className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    >
                                        <option>October 2023</option>
                                        <option>November 2023</option>
                                        <option>December 2023</option>
                                        <option>January 2024</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/20">
                                        <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">Employees</p>
                                        <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">{allUsers.length}</p>
                                    </div>
                                    <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/20">
                                        <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1">Total Est.</p>
                                        <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">{formatCurrency(allUsers.reduce((sum, u) => sum + (u.compensation?.baseSalary || 0) / 12, 0))}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20">
                                    <div className="mt-0.5 text-blue-600 dark:text-blue-400">
                                        <Clock size={18} />
                                    </div>
                                    <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                                        Processing may take a few moments. Direct deposits will be initiated immediately upon confirmation.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-8">
                                <button
                                    onClick={() => setIsRunPayrollModalOpen(false)}
                                    disabled={isProcessing}
                                    className="flex-1 py-3 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleRunPayroll}
                                    disabled={isProcessing}
                                    className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none transition-all flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        'Confirm & Run'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Salary Modal */}
            {isEditSalaryModalOpen && editingUser && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-800 animate-scale-in">
                        <div className="p-8">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Update Salary</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-6">Updating base salary for <span className="font-bold text-slate-900 dark:text-white">{editingUser.name}</span></p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Annual Base Salary</label>
                                    <div className="relative">
                                        <DollarSign size={18} className="absolute left-3 top-3 text-slate-400" />
                                        <input
                                            type="number"
                                            value={editForm.baseSalary}
                                            onChange={(e) => setEditForm({ ...editForm, baseSalary: Number(e.target.value) })}
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Effective Date</label>
                                    <input
                                        type="date"
                                        value={editForm.effectiveDate}
                                        onChange={(e) => setEditForm({ ...editForm, effectiveDate: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-8">
                                <button
                                    onClick={() => setIsEditSalaryModalOpen(false)}
                                    className="flex-1 py-3 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateSalary}
                                    className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none transition-all"
                                >
                                    Update Salary
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Payroll Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage employee salaries, pay stubs, and tax compliance.</p>
                </div>
                {isAdmin && (
                    <button
                        onClick={() => setIsRunPayrollModalOpen(true)}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-200 dark:shadow-none transition-all"
                    >
                        <Plus size={20} />
                        Run New Payroll
                    </button>
                )}
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
                            <TrendingUp size={24} />
                        </div>
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg flex items-center gap-1">
                            <ArrowUpRight size={14} /> +4.2%
                        </span>
                    </div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Gross Pay</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{formatCurrency(payrollRuns.reduce((sum, run) => sum + run.totalGross, 0) || 67000)}</h3>
                    <p className="text-xs text-slate-400 mt-2">All time</p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
                            <DollarSign size={24} />
                        </div>
                        <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 px-2 py-1 rounded-lg flex items-center gap-1">
                            <ArrowDownRight size={14} /> -2.1%
                        </span>
                    </div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Net Pay Disbursed</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{formatCurrency(payrollRuns.reduce((sum, run) => sum + run.totalNet, 0) || 51500)}</h3>
                    <p className="text-xs text-slate-400 mt-2">All time</p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl">
                            <Users size={24} />
                        </div>
                    </div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Employees</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{allUsers.length}</h3>
                    <p className="text-xs text-slate-400 mt-2">Across all departments</p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl">
                            <Clock size={24} />
                        </div>
                    </div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Next Pay Date</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">Dec 25, 2023</h3>
                    <p className="text-xs text-slate-400 mt-2">Christmas Cycle</p>
                </div>
            </div>

            {/* Tabs & Filters */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex gap-2">
                        {isAdmin && (
                            <button
                                onClick={() => setActiveTab('runs')}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === 'runs' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                            >
                                Payroll Runs
                            </button>
                        )}
                        <button
                            onClick={() => setActiveTab('stubs')}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === 'stubs' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                        >
                            {isAdmin ? 'All Pay Stubs' : 'My Pay Stubs'}
                        </button>
                        {isAdmin && (
                            <button
                                onClick={() => setActiveTab('salaries')}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === 'salaries' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                            >
                                Employee Salaries
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative hidden sm:block">
                            <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64"
                            />
                        </div>
                        <button className="p-2 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                            <Filter size={18} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {activeTab === 'runs' && isAdmin ? (
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Period</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Run Date</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Employees</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Total Gross</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Total Net</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {payrollRuns.map((run) => (
                                    <tr key={run.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg">
                                                    <Calendar size={18} />
                                                </div>
                                                <span className="font-semibold text-slate-900 dark:text-white">{run.period}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-sm">{run.runDate}</td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-sm">{run.totalEmployees}</td>
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{formatCurrency(run.totalGross)}</td>
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{formatCurrency(run.totalNet)}</td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={run.status} />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-all">
                                                <MoreVertical size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : activeTab === 'stubs' ? (
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Employee</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Period</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Pay Date</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Gross</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Net Pay</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {payStubs.filter(s => isAdmin || s.userId === user.email).map((stub) => (
                                    <tr key={stub.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-6 py-4 text-slate-900 dark:text-white font-medium">{stub.userName}</td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-sm">{stub.period}</td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-sm">{stub.payDate}</td>
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{formatCurrency(stub.grossPay)}</td>
                                        <td className="px-6 py-4 font-bold text-indigo-600 dark:text-indigo-400 text-lg">{formatCurrency(stub.netPay)}</td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={stub.status} />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                <button className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all shadow-sm">
                                                    <Download size={18} />
                                                </button>
                                                <button className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all shadow-sm">
                                                    <FileText size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Employee</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Annual Base Salary</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Monthly Est.</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Effective Date</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {allUsers.map((u) => (
                                    <tr key={u.email} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-400">
                                                    {u.avatarInitials}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900 dark:text-white text-sm">{u.name}</p>
                                                    <p className="text-xs text-slate-500">{u.employment?.jobTitle || 'Team Member'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{formatCurrency(u.compensation?.baseSalary || 0)}</td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-sm">{formatCurrency((u.compensation?.baseSalary || 0) / 12)}</td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-sm">{u.compensation?.effectiveDate || 'N/A'}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleEditSalary(u)}
                                                className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                Edit Salary
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Compliance Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-indigo-600 rounded-2xl p-6 text-white overflow-hidden relative shadow-xl shadow-indigo-900/20">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg">
                                <ShieldCheck size={24} />
                            </div>
                            <h3 className="text-xl font-bold">Tax Compliance</h3>
                        </div>
                        <p className="text-indigo-100 mb-6 leading-relaxed">Your company's tax withholdings and employer contributions are automatically calculated based on local regulations.</p>
                        <button className="bg-white text-indigo-600 px-5 py-2.5 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
                            View Tax Settings <ChevronRight size={18} />
                        </button>
                    </div>
                    {/* Abstract decor */}
                    <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg">
                            <TrendingUp size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Annual Summary</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Total YTD Payroll</span>
                            <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(payrollRuns.reduce((sum, run) => sum + run.totalGross, 0) || 412000)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Total YTD Taxes Paid</span>
                            <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(payrollRuns.reduce((sum, run) => sum + run.totalGross * 0.2, 0) || 84500)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payroll;
