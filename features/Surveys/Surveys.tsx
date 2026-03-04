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

export default function Surveys(props: any) {
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
    setIsTemplateModalOpen, startCycleForm, setStartCycleForm, generatingItinerary
  } = props;

  return (
    
               <div className="max-w-7xl mx-auto animate-fade-in">
                   <div className="flex justify-between items-center mb-6">
                       <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Surveys</h2>
                       {user.role === 'Administrator' && (
                           <button onClick={() => setIsCreateSurveyModalOpen(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-900/30 flex items-center gap-2">
                               <Plus size={18} /> Create Survey
                           </button>
                       )}
                   </div>
                   
                   <div className="grid grid-cols-1 gap-4">
                       {surveys.map(survey => (
                           <div key={survey.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                               <div>
                                   <div className="flex items-center gap-3 mb-2">
                                       <h3 className="text-lg font-bold text-slate-900 dark:text-white">{survey.title}</h3>
                                       <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${survey.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>{survey.isActive ? 'Active' : 'Closed'}</span>
                                   </div>
                                   <p className="text-sm text-slate-500 mb-2">{survey.description}</p>
                                   <p className="text-xs text-slate-400">Created by {survey.createdBy} on {survey.createdAt}</p>
                               </div>
                               <div className="flex gap-3">
                                   {user.role === 'Administrator' ? (
                                       <>
                                           <button onClick={() => { setSelectedSurvey(survey); setIsSurveyResultsModalOpen(true); }} className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800">
                                               View Results
                                           </button>
                                           <button onClick={() => setConfirmationModal({ isOpen: true, title: 'Delete Survey', message: 'Delete this survey?', action: 'delete-survey', itemId: survey.id, isDestructive: true })} className="p-2 text-slate-400 hover:text-red-600 rounded-lg">
                                               <Trash2 size={18} />
                                           </button>
                                       </>
                                   ) : (
                                       <button 
                                           onClick={() => { setSelectedSurvey(survey); setIsTakeSurveyModalOpen(true); }}
                                           disabled={!survey.isActive || surveyResponses.some(r => r.surveyId === survey.id && r.userEmail === user.email)}
                                           className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                       >
                                           {surveyResponses.some(r => r.surveyId === survey.id && r.userEmail === user.email) ? 'Completed' : 'Take Survey'}
                                       </button>
                                   )}
                               </div>
                           </div>
                       ))}
                   </div>
               </div>
           
  );
}
