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

export default function Jobs(props: any) {
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
        handleInitiateApply, setEditingJobId, setNewJob
    } = props;

    return (

        <div className="max-w-7xl mx-auto animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Internal Jobs</h2>
                {user.role === 'Administrator' && (
                    <button onClick={() => setIsJobModalOpen(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-900/30 flex items-center gap-2">
                        <Plus size={18} /> Post New Job
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 gap-4">
                {jobs.map(job => (
                    <div key={job.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{job.title}</h3>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${job.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>{job.status}</span>
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400 mb-3">
                                <span className="flex items-center gap-1"><Briefcase size={14} /> {job.department}</span>
                                <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                                <span className="flex items-center gap-1"><Clock size={14} /> {job.type}</span>
                                <span className="flex items-center gap-1"><DollarSign size={14} /> {job.salaryRange}</span>
                            </div>
                            <p className="text-sm text-slate-500 max-w-2xl">{job.description}</p>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            {user.role === 'Administrator' ? (
                                <>
                                    <button
                                        onClick={() => { setSelectedJobForApplication(job); setIsApplicationModalOpen(true); }}
                                        className="flex-1 md:flex-none px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                                    >
                                        View Candidates ({applications.filter(a => a.jobId === job.id).length})
                                    </button>
                                    <button
                                        onClick={() => { setEditingJobId(job.id); setNewJob(job); setIsJobModalOpen(true); }}
                                        className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-50 dark:bg-slate-800 rounded-lg"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => handleInitiateApply(job)}
                                    disabled={applications.some(a => a.jobId === job.id && a.applicantEmail === user.email)}
                                    className="flex-1 md:flex-none px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {applications.some(a => a.jobId === job.id && a.applicantEmail === user.email) ? 'Applied' : 'Apply Now'}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>

    );
}
