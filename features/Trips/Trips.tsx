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

export default function Trips(props: any) {
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
                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                       <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Trips</h2>
                       <button onClick={() => setIsTripModalOpen(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-900/30 flex items-center gap-2">
                           <Plus size={18} /> Plan New Trip
                       </button>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {trips.map(trip => (
                           <div key={trip.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col hover:shadow-md transition-shadow group">
                               <div className="flex justify-between items-start mb-4">
                                   <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                       <Plane size={24} />
                                   </div>
                                   <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${trip.status === 'Completed' ? 'bg-slate-100 text-slate-600' : 'bg-green-100 text-green-700'}`}>
                                       {trip.status}
                                   </span>
                               </div>
                               <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{trip.destination}</h3>
                               <p className="text-sm text-slate-500 mb-4">{trip.purpose}</p>
                               
                               <div className="space-y-3 mb-6 flex-1">
                                   <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                       <Calendar size={16} className="text-slate-400"/>
                                       <span>{trip.startDate} - {trip.endDate}</span>
                                   </div>
                                   <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                       <DollarSign size={16} className="text-slate-400"/>
                                       <span>Budget: ${trip.budget.toLocaleString()}</span>
                                   </div>
                               </div>

                               <div className="flex gap-2 mt-auto">
                                   <button 
                                      onClick={() => handleGenerateItinerary(trip)} 
                                      className="flex-1 py-2 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300 rounded-lg text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors flex items-center justify-center gap-2"
                                      disabled={isGeneratingItinerary && selectedTripForItinerary?.id === trip.id}
                                   >
                                       {isGeneratingItinerary && selectedTripForItinerary?.id === trip.id ? <Loader2 size={16} className="animate-spin"/> : <MapIcon size={16} />}
                                       {trip.itinerary ? 'View Itinerary' : 'Generate Itinerary'}
                                   </button>
                                   <button 
                                      onClick={() => { setEditingTripId(trip.id); setNewTrip(trip); setIsTripModalOpen(true); }}
                                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 dark:bg-slate-800 rounded-lg transition-colors"
                                   >
                                      <Pencil size={18} />
                                   </button>
                               </div>
                           </div>
                       ))}
                   </div>
               </div>
           
  );
}
