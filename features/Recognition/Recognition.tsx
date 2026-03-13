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

export default function Recognition(props: any) {
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
        setIsPraiseModalOpen
    } = props;

    return (

        <div className="max-w-7xl mx-auto animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Recognition & Praise</h2>
                <button onClick={() => setIsPraiseModalOpen(true)} className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors shadow-lg shadow-pink-900/30 flex items-center gap-2">
                    <Award size={18} /> Send Praise
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {praiseList.map(praise => (
                    <div key={praise.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                                {praise.fromUserInitials}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-slate-900 dark:text-white">{praise.fromUserName} <span className="text-slate-400 font-normal">praised</span> {praise.toUserName}</p>
                                <p className="text-xs text-slate-500">{praise.date}</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center">
                                <Heart size={16} fill="currentColor" />
                            </div>
                        </div>
                        <div className="mb-4">
                            <span className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-xs font-bold rounded-md uppercase tracking-wide">
                                {praise.category}
                            </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 text-sm italic">"{praise.message}"</p>
                    </div>
                ))}
            </div>
        </div>

    );
}
