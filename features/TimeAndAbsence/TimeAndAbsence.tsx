import React from 'react';
import {
    Plus, Search, Bell, Settings, MoreVertical, Calendar, DollarSign, Plane, FileText, X, Loader2, MapPin, Map as MapIcon, Link as LinkIcon, Building2, Eye, ShieldCheck, ArrowRight, UserPlus, FileStack, LayoutDashboard, Receipt, Clock, Users, Target, Briefcase, Heart, BookOpen, UserCircle, LogOut, Moon, Sun, BriefcaseBusiness, CalendarDays, Check, ListChecks, MessageSquare, Download, ClipboardList, PenTool, Sparkles, AlertCircle, BookTemplate, UserCog, User, Globe, LockKeyhole, FileEdit, Trash2, GraduationCap, Award, Upload, Pencil, Send, Smile, Info, ChevronRight, Activity, Camera, RotateCcw, Building
} from 'lucide-react';
import {
    Expense, Trip, ViewState, AppNotification, UserProfile, Budget, ChatMessage, Company, Praise, Job, JobApplication, TimeEntry, AbsenceRequest, Survey, EmployeeReview, ReviewTemplate, Goal,
    ExpenseCategory, AbsenceType, InterviewSentiment
} from '../../types';
import DashboardStats from '../../components/DashboardStats';
import JobCard from '../../components/JobCard';
import ReceiptUploader from '../../components/ReceiptUploader';
import EmployerProfile from '../../components/EmployerProfile';
import ApplicantProfile from '../../components/ApplicantProfile';
import JobDetail from '../../components/JobDetail';

export default function TimeAndAbsence(props: any) {
    // Destructure everything from props
    const {
        user, expenses, trips, setView, jobs, surveys, allUsers, timeEntries, absenceRequests,
        praiseList, reviewTemplates, reviews, goals, applications, myTeam, isManager,
        visibleExpensesCount, setVisibleExpensesCount,
        calculateLeaveBalance, handleGenerateItinerary, isGeneratingItinerary,
        selectedTripForItinerary, setEditingTripId, setNewTrip, setIsTripModalOpen,
        setActiveTimeAbsenceTab, setIsTimeModalOpen, setIsAbsenceModalOpen, activeTimeAbsenceTab,
        timeAbsenceViewMode, setTimeAbsenceViewMode, teamTimeEntries, teamAbsenceRequests,
        setConfirmationModal, handleUpdateGoalStatus, setIsGoalModalOpen,
        setIsSettingModalOpen, setActiveSettingsTab, setIsManageTeamModalOpen,
        setIsJobModalOpen, setIsApplicationModalOpen, setSelectedJobForApplication,
        setIsInviteUserModalOpen, isDocumentUploadModalOpen, setIsDocumentUploadModalOpen,
        setIsCreateSurveyModalOpen, setIsTakeSurveyModalOpen, setIsSurveyResultsModalOpen,
        setSelectedSurvey, handleUpdateStatus, isReviewModalOpen, handleOpenReviewModal, setIsStartCycleModalOpen,
        setIsTemplateModalOpen, startCycleForm, setStartCycleForm
    } = props;

    return (

        <div className="max-w-7xl mx-auto animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Time & Absence</h2>
                <div className="flex gap-2">
                    {isManager && (
                        <div className="flex gap-2 bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                            <button onClick={() => setTimeAbsenceViewMode('personal')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${timeAbsenceViewMode === 'personal' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>Personal</button>
                            <button onClick={() => setTimeAbsenceViewMode('team')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${timeAbsenceViewMode === 'team' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>Team Approvals</button>
                        </div>
                    )}
                    <button onClick={() => { setActiveTimeAbsenceTab('time'); setIsTimeModalOpen(true); }} className="px-4 py-2 bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2">
                        <Clock size={18} /> Log Time
                    </button>
                    <button onClick={() => { setActiveTimeAbsenceTab('absence'); setIsAbsenceModalOpen(true); }} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-900/30 flex items-center gap-2">
                        <CalendarDays size={18} /> Request Leave
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="border-b border-slate-200 dark:border-slate-800">
                    <nav className="flex -mb-px">
                        <button onClick={() => setActiveTimeAbsenceTab('time')} className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${activeTimeAbsenceTab === 'time' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Timesheet</button>
                        <button onClick={() => setActiveTimeAbsenceTab('absence')} className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${activeTimeAbsenceTab === 'absence' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Absence</button>
                    </nav>
                </div>

                {activeTimeAbsenceTab === 'absence' && timeAbsenceViewMode === 'personal' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-bold">Vacation Days</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{calculateLeaveBalance(AbsenceType.VACATION)} <span className="text-slate-400 text-lg font-normal">/ 15</span></p>
                            </div>
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600"><Sun size={20} /></div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-bold">Sick Leave</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{calculateLeaveBalance(AbsenceType.SICK)} <span className="text-slate-400 text-lg font-normal">/ 5</span></p>
                            </div>
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600"><Heart size={20} /></div>
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto">
                    {activeTimeAbsenceTab === 'time' ? (
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase text-slate-500">
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
                                {(timeAbsenceViewMode === 'personal' ? timeEntries.filter(t => t.userId === user.email) : teamTimeEntries).map(entry => (
                                    <tr key={entry.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{entry.date}</td>
                                        {timeAbsenceViewMode === 'team' && <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{entry.userName}</td>}
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{entry.startTime}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{entry.endTime}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{entry.breakMinutes || 0}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">{entry.totalHours}h</td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 max-w-[200px] truncate">{entry.description}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                                       ${entry.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                    entry.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-amber-100 text-amber-800'}`}>
                                                {entry.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {timeAbsenceViewMode === 'team' && entry.status === 'Pending' ? (
                                                <div className="flex gap-2">
                                                    <button onClick={() => setConfirmationModal({ isOpen: true, title: 'Approve Time', message: 'Approve this timesheet entry?', action: 'approve-time', itemId: entry.id })} className="p-1 text-green-600 hover:bg-green-50 rounded"><Check size={18} /></button>
                                                    <button onClick={() => setConfirmationModal({ isOpen: true, title: 'Reject Time', message: 'Reject this timesheet entry?', action: 'reject-time', itemId: entry.id, isDestructive: true })} className="p-1 text-red-600 hover:bg-red-50 rounded"><X size={18} /></button>
                                                </div>
                                            ) : timeAbsenceViewMode === 'personal' && entry.status === 'Pending' && (
                                                <button onClick={() => setConfirmationModal({ isOpen: true, title: 'Delete Entry', message: 'Are you sure you want to delete this pending time entry?', action: 'delete-time-entry', itemId: entry.id, isDestructive: true })} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase text-slate-500">
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
                                {(timeAbsenceViewMode === 'personal' ? absenceRequests.filter(a => a.userId === user.email) : teamAbsenceRequests).map(req => (
                                    <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{req.startDate} - {req.endDate}</td>
                                        {timeAbsenceViewMode === 'team' && <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{req.userName}</td>}
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{req.type}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{req.reason}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                                       ${req.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                    req.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-amber-100 text-amber-800'}`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {timeAbsenceViewMode === 'team' && req.status === 'Pending' ? (
                                                <div className="flex gap-2">
                                                    <button onClick={() => setConfirmationModal({ isOpen: true, title: 'Approve Absence', message: 'Approve this leave request?', action: 'approve-absence', itemId: req.id })} className="p-1 text-green-600 hover:bg-green-50 rounded"><Check size={18} /></button>
                                                    <button onClick={() => setConfirmationModal({ isOpen: true, title: 'Reject Absence', message: 'Reject this leave request?', action: 'reject-absence', itemId: req.id, isDestructive: true })} className="p-1 text-red-600 hover:bg-red-50 rounded"><X size={18} /></button>
                                                </div>
                                            ) : timeAbsenceViewMode === 'personal' && req.status === 'Pending' && (
                                                <button onClick={() => setConfirmationModal({ isOpen: true, title: 'Cancel Request', message: 'Cancel this pending absence request?', action: 'delete-absence-request', itemId: req.id, isDestructive: true })} className="text-red-500 hover:text-red-700 text-sm font-medium">Cancel</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>

    );
}
