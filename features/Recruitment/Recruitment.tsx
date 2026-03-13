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

export default function Recruitment(props: any) {
    // Destructure everything from props
    const {
        user, expenses, trips, setView, jobs, surveys, allUsers, timeEntries, absenceRequests,
        praiseList, reviewTemplates, reviews, goals, applications, myTeam, isManager,
        visibleExpensesCount, setVisibleExpensesCount,
        calculateLeaveBalance, handleGenerateItinerary, isGeneratingItinerary,
        selectedTripForItinerary, setEditingTripId, setNewTrip, setIsTripModalOpen,
        setActiveTimeAbsenceTab, setIsTimeModalOpen, setIsAbsenceModalOpen,
        timeAbsenceViewMode, setTimeAbsenceViewMode, teamTimeEntries, teamAbsenceRequests,
        setConfirmationModal, handleUpdateGoalStatus, setIsGoalModalOpen,
        setIsSettingModalOpen, setActiveSettingsTab, setIsManageTeamModalOpen,
        setIsJobModalOpen, setIsApplicationModalOpen, setSelectedJobForApplication,
        setIsInviteUserModalOpen, isDocumentUploadModalOpen, setIsDocumentUploadModalOpen,
        setIsCreateSurveyModalOpen, setIsTakeSurveyModalOpen, setIsSurveyResultsModalOpen,
        setSelectedSurvey, handleUpdateStatus, isReviewModalOpen, handleOpenReviewModal, setIsStartCycleModalOpen,
        setIsTemplateModalOpen, startCycleForm, setStartCycleForm,
        activeRecruitmentTab, setActiveRecruitmentTab, setSelectedApplication,
        setIsAssignInterviewerModalOpen, setSelectedReviewId, setIsFeedbackModalOpen,
        selectedApplication, selectedReviewId, isFeedbackModalOpen,
        feedbackForm, setFeedbackForm, handleSubmitFeedback
    } = props;

    return (
        <>
            <div className="max-w-7xl mx-auto animate-fade-in">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Recruitment</h2>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="border-b border-slate-200 dark:border-slate-800">
                        <nav className="flex -mb-px">
                            {user.role === 'Administrator' && (
                                <button onClick={() => setActiveRecruitmentTab('candidates')} className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${activeRecruitmentTab === 'candidates' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>All Candidates</button>
                            )}
                            <button onClick={() => setActiveRecruitmentTab('interviews')} className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${activeRecruitmentTab === 'interviews' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Interviews</button>
                        </nav>
                    </div>

                    {activeRecruitmentTab === 'candidates' && user.role === 'Administrator' && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase text-slate-500">
                                    <tr>
                                        <th className="px-6 py-4">Candidate</th>
                                        <th className="px-6 py-4">Role</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">CV</th>
                                        <th className="px-6 py-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {applications.map(app => {
                                        const job = jobs.find(j => j.id === app.jobId);
                                        return (
                                            <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="font-medium text-slate-900 dark:text-white">{app.applicantName}</p>
                                                        <p className="text-xs text-slate-500">{app.applicantEmail}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{job?.title}</td>
                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{app.appliedDate}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                                           ${app.status === 'Hired' ? 'bg-green-100 text-green-800' :
                                                            app.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                                app.status === 'Interview' ? 'bg-blue-100 text-blue-800' :
                                                                    'bg-amber-100 text-amber-800'}`}>
                                                        {app.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {app.cvUrl ? (
                                                        <a href={app.cvUrl} download={app.cvName} className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-xs font-medium">
                                                            <FileText size={14} /> {app.cvName || 'Download'}
                                                        </a>
                                                    ) : <span className="text-slate-400 text-xs">No CV</span>}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        <button onClick={() => { setSelectedApplication(app); setIsAssignInterviewerModalOpen(true); }} className="p-1.5 text-slate-500 hover:text-indigo-600 bg-slate-100 dark:bg-slate-800 rounded" title="Schedule Interview"><Calendar size={16} /></button>
                                                        <button onClick={() => setConfirmationModal({ isOpen: true, title: 'Hire Candidate', message: `Are you sure you want to hire ${app.applicantName}?`, action: 'hire-candidate', itemId: app.id })} className="p-1.5 text-slate-500 hover:text-green-600 bg-slate-100 dark:bg-slate-800 rounded" title="Hire"><Check size={16} /></button>
                                                        <button onClick={() => setConfirmationModal({ isOpen: true, title: 'Reject Candidate', message: `Reject application for ${app.applicantName}?`, action: 'reject-candidate', itemId: app.id, isDestructive: true })} className="p-1.5 text-slate-500 hover:text-red-600 bg-slate-100 dark:bg-slate-800 rounded" title="Reject"><X size={16} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeRecruitmentTab === 'interviews' && (
                        <div className="p-6">
                            <div className="space-y-4">
                                {applications.flatMap(app =>
                                    app.reviews
                                        .filter(rev => user.role === 'Administrator' || rev.interviewerEmail === user.email)
                                        .map(rev => (
                                            <div key={rev.id} className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex justify-between items-center">
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white">Interview with {app.applicantName}</p>
                                                    <p className="text-sm text-slate-500">Scheduled: {rev.assignedDate}</p>
                                                    <p className="text-xs text-indigo-600 mt-1">Role: {jobs.find(j => j.id === app.jobId)?.title}</p>
                                                </div>
                                                <div>
                                                    {rev.status === 'Completed' ? (
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Completed</span>
                                                    ) : (
                                                        <button
                                                            onClick={() => { setSelectedApplication(app); setSelectedReviewId(rev.id); setIsFeedbackModalOpen(true); }}
                                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
                                                        >
                                                            Submit Feedback
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                )}
                                {applications.flatMap(app => app.reviews).filter(rev => user.role === 'Administrator' || rev.interviewerEmail === user.email).length === 0 && (
                                    <p className="text-center text-slate-500 py-8">No scheduled interviews found.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Submit Interview Feedback Modal ── */}
            {
                isFeedbackModalOpen && selectedApplication && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Submit Interview Feedback">
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setIsFeedbackModalOpen(false); setFeedbackForm({ notes: '', sentiment: 'Neutral' }); }} />
                        <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-700 animate-fade-in">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl"><MessageSquare size={18} className="text-indigo-600 dark:text-indigo-400" /></div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Submit Feedback</h2>
                                        <p className="text-xs text-slate-500">Interview with {selectedApplication.applicantName}</p>
                                    </div>
                                </div>
                                <button onClick={() => { setIsFeedbackModalOpen(false); setFeedbackForm({ notes: '', sentiment: 'Neutral' }); }} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"><X size={18} /></button>
                            </div>
                            <form
                                onSubmit={e => {
                                    e.preventDefault();
                                    handleSubmitFeedback(selectedApplication, selectedReviewId!, feedbackForm, () => {
                                        setIsFeedbackModalOpen(false);
                                        setFeedbackForm({ notes: '', sentiment: 'Neutral' });
                                    });
                                }}
                                className="p-6 space-y-4"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Sentiment <span className="text-red-500">*</span></label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {(['Positive', 'Neutral', 'Negative'] as const).map(s => (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => setFeedbackForm((p: any) => ({ ...p, sentiment: s }))}
                                                className={`py-2 rounded-xl border text-xs font-medium transition-all ${feedbackForm.sentiment === s
                                                    ? s === 'Positive' ? 'bg-green-100 border-green-200 text-green-700 dark:bg-green-900/40 dark:border-green-800 dark:text-green-300'
                                                        : s === 'Negative' ? 'bg-red-100 border-red-200 text-red-700 dark:bg-red-900/40 dark:border-red-800 dark:text-red-300'
                                                            : 'bg-amber-100 border-amber-200 text-amber-700 dark:bg-amber-900/40 dark:border-amber-800 dark:text-amber-300'
                                                    : 'bg-slate-50 border-slate-100 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 hover:bg-slate-100'
                                                    }`}
                                            >
                                                {s === 'Positive' ? '✅' : s === 'Negative' ? '❌' : '⚪'} {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Interview Notes <span className="text-red-500">*</span></label>
                                    <textarea required rows={5} placeholder="Describe how the interview went, key strengths, concerns..." value={feedbackForm.notes || ''} onChange={e => setFeedbackForm((p: any) => ({ ...p, notes: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none" />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => { setIsFeedbackModalOpen(false); setFeedbackForm({ notes: '', sentiment: 'Neutral' }); }} className="flex-1 py-2.5 text-slate-600 dark:text-slate-300 font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors text-sm">Cancel</button>
                                    <button type="submit" className="flex-[2] py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-900/20 text-sm">Submit Feedback</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
        </>
    );
}
