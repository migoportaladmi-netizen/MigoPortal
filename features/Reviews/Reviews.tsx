import React from 'react';
import {
    Plus, Search, Bell, Settings, MoreVertical, Calendar, DollarSign, Plane, FileText, X, Loader2, MapPin, Map as MapIcon, Link as LinkIcon, Building2, Eye, ShieldCheck, ArrowRight, UserPlus, FileStack, LayoutDashboard, Receipt, Clock, Users, Target, Briefcase, Heart, BookOpen, UserCircle, LogOut, Moon, Sun, BriefcaseBusiness, CalendarDays, Check, ListChecks, MessageSquare, Download, ClipboardList, PenTool, Sparkles, AlertCircle, BookTemplate, UserCog, User, Globe, LockKeyhole, FileEdit, Trash2, GraduationCap, Award, Upload, Pencil, Send, Smile, Info, ChevronRight, Activity, Camera, RotateCcw, Building, Star
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

export default function Reviews(props: any) {
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
        setIsTemplateModalOpen, startCycleForm, setStartCycleForm, generatingItinerary,
        activeReviewTab, setActiveReviewTab
    } = props;

    return (

        <div className="max-w-7xl mx-auto animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Performance Reviews</h2>
                <div className="flex gap-2">
                    {isManager && (
                        <div className="flex gap-2 bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                            <button onClick={() => setActiveReviewTab('my-reviews')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeReviewTab === 'my-reviews' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>My Reviews</button>
                            <button onClick={() => setActiveReviewTab('team-reviews')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeReviewTab === 'team-reviews' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>Team Reviews</button>
                        </div>
                    )}
                    {user.role === 'Administrator' && (
                        <>
                            <button onClick={() => { setIsTemplateModalOpen(true); }} className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2">
                                <BookTemplate size={18} /> Manage Templates
                            </button>
                            <button onClick={() => setIsStartCycleModalOpen(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-900/30 flex items-center gap-2">
                                <Plus size={18} /> Start Cycle
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(activeReviewTab === 'my-reviews'
                    ? reviews.filter(r => r.employeeEmail === user.email)
                    : reviews.filter(r => r.managerEmail === user.email)
                ).map(review => (
                    <div key={review.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white">{review.period}</h3>
                                <p className="text-xs text-slate-500">{activeReviewTab === 'team-reviews' ? `Employee: ${review.employeeName}` : `Manager: ${review.managerName}`}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${review.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                review.status === 'Pending Manager' ? 'bg-blue-100 text-blue-700' :
                                    'bg-amber-100 text-amber-700'
                                }`}>
                                {review.status}
                            </span>
                        </div>

                        <div className="space-y-4 mb-6 flex-1">
                            {review.status === 'Completed' ? (
                                <div className="flex items-center gap-2">
                                    <div className="flex text-yellow-400">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <Star key={star} size={16} fill={star <= (review.managerRating || 0) ? "currentColor" : "none"} className={star <= (review.managerRating || 0) ? "" : "text-slate-300"} />
                                        ))}
                                    </div>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Final Rating</span>
                                </div>
                            ) : (
                                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-sm text-slate-600 dark:text-slate-400 italic">
                                    {review.status === 'Pending Self' ? 'Waiting for self-review submission.' : 'Self-review submitted. Pending manager feedback.'}
                                </div>
                            )}
                            {review.templateId && <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500">Structured Review</span>}
                        </div>

                        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                            {(activeReviewTab === 'my-reviews' && review.status === 'Pending Self') ||
                                (activeReviewTab === 'team-reviews' && review.status === 'Pending Manager') ? (
                                <button onClick={() => handleOpenReviewModal(review)} className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                                    {activeReviewTab === 'my-reviews' ? 'Complete Self Review' : 'Write Manager Review'}
                                </button>
                            ) : (
                                <button onClick={() => handleOpenReviewModal(review)} className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                    View Details
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {(activeReviewTab === 'my-reviews'
                    ? reviews.filter(r => r.employeeEmail === user.email)
                    : reviews.filter(r => r.managerEmail === user.email)
                ).length === 0 && (
                        <div className="col-span-3 text-center py-12 text-slate-500">
                            <FileStack size={48} className="mx-auto mb-4 opacity-50" />
                            <p>No reviews found for this view.</p>
                        </div>
                    )}
            </div>
        </div>

    );
}
