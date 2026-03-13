import React from 'react';
import { CalendarDays, Check, X, Sun, Heart, Umbrella, Briefcase } from 'lucide-react';
import { AbsenceRequest, AbsenceType } from '../../types';

export default function Absence(props: any) {
    const {
        user, absenceRequests, isManager,
        calculateLeaveBalance, setIsAbsenceModalOpen, setActiveTimeAbsenceTab,
        timeAbsenceViewMode, setTimeAbsenceViewMode,
        teamAbsenceRequests, setConfirmationModal,
    } = props;

    const myRequests: AbsenceRequest[] = absenceRequests.filter((a: AbsenceRequest) => a.userId === user.email);
    const requests: AbsenceRequest[] = timeAbsenceViewMode === 'personal' ? myRequests : (teamAbsenceRequests || []);

    const statusBadge = (status: string) => {
        const cls =
            status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                status === 'Rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                    'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
        return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>{status}</span>;
    };

    const leaveCards = [
        { label: 'Vacation Days', icon: <Sun size={20} />, type: AbsenceType.VACATION, total: 15, color: 'green' },
        { label: 'Sick Leave', icon: <Heart size={20} />, type: AbsenceType.SICK, total: 5, color: 'blue' },
        { label: 'Personal', icon: <Umbrella size={20} />, type: AbsenceType.PERSONAL, total: 3, color: 'purple' },
        { label: 'Remote Work', icon: <Briefcase size={20} />, type: AbsenceType.REMOTE, total: 30, color: 'indigo' },
    ];

    const colorMap: Record<string, string> = {
        green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
        blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
        purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
        indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
    };

    return (
        <div className="max-w-7xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Absence</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage leave requests and balances</p>
                </div>
                <div className="flex gap-2">
                    {isManager && (
                        <div className="flex gap-1 bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                            <button
                                onClick={() => setTimeAbsenceViewMode('personal')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${timeAbsenceViewMode === 'personal' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                            >Personal</button>
                            <button
                                onClick={() => setTimeAbsenceViewMode('team')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${timeAbsenceViewMode === 'team' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                            >Team Approvals</button>
                        </div>
                    )}
                    <button
                        onClick={() => { setActiveTimeAbsenceTab?.('absence'); setIsAbsenceModalOpen(true); }}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-900/30 flex items-center gap-2"
                    >
                        <CalendarDays size={16} /> Request Leave
                    </button>
                </div>
            </div>

            {/* Leave Balance Cards (personal view only) */}
            {timeAbsenceViewMode === 'personal' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    {leaveCards.map(card => (
                        <div key={card.label} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">{card.label}</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                                    {calculateLeaveBalance ? calculateLeaveBalance(card.type) : '—'}
                                    <span className="text-slate-400 text-base font-normal"> / {card.total}</span>
                                </p>
                            </div>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${colorMap[card.color]}`}>
                                {card.icon}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Requests Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="font-semibold text-slate-800 dark:text-white">
                        {timeAbsenceViewMode === 'team' ? 'Team Leave Requests' : 'My Leave Requests'}
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase text-slate-500 font-semibold">
                            <tr>
                                <th className="px-6 py-4">Dates</th>
                                {timeAbsenceViewMode === 'team' && <th className="px-6 py-4">Employee</th>}
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Reason</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {requests.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">
                                        <CalendarDays size={32} className="mx-auto mb-2 opacity-40" />
                                        No leave requests found. Click "Request Leave" to submit one.
                                    </td>
                                </tr>
                            ) : requests.map((req: AbsenceRequest) => (
                                <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">{req.startDate} → {req.endDate}</td>
                                    {timeAbsenceViewMode === 'team' && <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{req.userName}</td>}
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">{req.type}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 max-w-[220px] truncate">{req.reason}</td>
                                    <td className="px-6 py-4">{statusBadge(req.status)}</td>
                                    <td className="px-6 py-4">
                                        {timeAbsenceViewMode === 'team' && req.status === 'Pending' ? (
                                            <div className="flex gap-2">
                                                <button onClick={() => setConfirmationModal({ isOpen: true, title: 'Approve Absence', message: 'Approve this leave request?', action: 'approve-absence', itemId: req.id })} className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors">
                                                    <Check size={16} />
                                                </button>
                                                <button onClick={() => setConfirmationModal({ isOpen: true, title: 'Reject Absence', message: 'Reject this leave request?', action: 'reject-absence', itemId: req.id, isDestructive: true })} className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : timeAbsenceViewMode === 'personal' && req.status === 'Pending' && (
                                            <button onClick={() => setConfirmationModal({ isOpen: true, title: 'Cancel Request', message: 'Cancel this leave request?', action: 'delete-absence-request', itemId: req.id, isDestructive: true })} className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors">
                                                Cancel
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
