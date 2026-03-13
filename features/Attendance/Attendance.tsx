import React from 'react';
import { Clock, Check, X, Trash2, CalendarDays } from 'lucide-react';
import { TimeEntry } from '../../types';

export default function Attendance(props: any) {
    const {
        user, timeEntries, isManager,
        setIsTimeModalOpen, setActiveTimeAbsenceTab,
        timeAbsenceViewMode, setTimeAbsenceViewMode,
        teamTimeEntries, setConfirmationModal,
    } = props;

    const myEntries: TimeEntry[] = timeEntries.filter((t: TimeEntry) => t.userId === user.email);
    const entries: TimeEntry[] = timeAbsenceViewMode === 'personal' ? myEntries : (teamTimeEntries || []);

    // Weekly summary
    const hoursThisWeek = myEntries.filter(e => {
        const d = new Date(e.date);
        const now = new Date();
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        return d >= weekStart;
    }).reduce((acc, e) => acc + e.totalHours, 0);

    const statusBadge = (status: string) => {
        const cls =
            status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                status === 'Rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                    'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
        return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>{status}</span>;
    };

    return (
        <div className="max-w-7xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Attendance</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track and manage time entries</p>
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
                        onClick={() => { setActiveTimeAbsenceTab?.('time'); setIsTimeModalOpen(true); }}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-900/30 flex items-center gap-2"
                    >
                        <Clock size={16} /> Log Time
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            {timeAbsenceViewMode === 'personal' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                        <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">This Week</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{hoursThisWeek.toFixed(1)}h</p>
                        <p className="text-xs text-slate-400 mt-1">of 40h target</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                        <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Total Entries</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{myEntries.length}</p>
                        <p className="text-xs text-slate-400 mt-1">all time</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                        <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Approved</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{myEntries.filter(e => e.status === 'Approved').length}</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                        <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Pending</p>
                        <p className="text-2xl font-bold text-amber-500 mt-1">{myEntries.filter(e => e.status === 'Pending').length}</p>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase text-slate-500 font-semibold">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                {timeAbsenceViewMode === 'team' && <th className="px-6 py-4">Employee</th>}
                                <th className="px-6 py-4">Start</th>
                                <th className="px-6 py-4">End</th>
                                <th className="px-6 py-4">Break (m)</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {entries.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="px-6 py-12 text-center text-slate-400 text-sm">
                                        <Clock size={32} className="mx-auto mb-2 opacity-40" />
                                        No time entries yet. Click "Log Time" to get started.
                                    </td>
                                </tr>
                            ) : entries.map((entry: TimeEntry) => (
                                <tr key={entry.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{entry.date}</td>
                                    {timeAbsenceViewMode === 'team' && <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{entry.userName}</td>}
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{entry.startTime}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{entry.endTime}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{entry.breakMinutes || 0}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">{entry.totalHours}h</td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 max-w-[200px] truncate">{entry.description}</td>
                                    <td className="px-6 py-4">{statusBadge(entry.status)}</td>
                                    <td className="px-6 py-4">
                                        {timeAbsenceViewMode === 'team' && entry.status === 'Pending' ? (
                                            <div className="flex gap-2">
                                                <button onClick={() => setConfirmationModal({ isOpen: true, title: 'Approve Time', message: 'Approve this timesheet entry?', action: 'approve-time', itemId: entry.id })} className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors">
                                                    <Check size={16} />
                                                </button>
                                                <button onClick={() => setConfirmationModal({ isOpen: true, title: 'Reject Time', message: 'Reject this timesheet entry?', action: 'reject-time', itemId: entry.id, isDestructive: true })} className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : timeAbsenceViewMode === 'personal' && entry.status === 'Pending' && (
                                            <button onClick={() => setConfirmationModal({ isOpen: true, title: 'Delete Entry', message: 'Are you sure you want to delete this time entry?', action: 'delete-time-entry', itemId: entry.id, isDestructive: true })} className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                                <Trash2 size={16} />
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
