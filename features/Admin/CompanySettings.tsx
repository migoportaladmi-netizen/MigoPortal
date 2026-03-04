import React from 'react';
import { 
  Plus, Search, Bell, Settings, MoreVertical, Calendar, DollarSign, Plane, FileText, X, Loader2, MapPin, Map as MapIcon, Link as LinkIcon, Building2, Eye, ShieldCheck, ArrowRight, UserPlus, FileStack, LayoutDashboard, Receipt, Clock, Users, Target, Briefcase, Heart, BookOpen, UserCircle, LogOut, Moon, Sun, BriefcaseBusiness, CalendarDays, Check, ListChecks, MessageSquare, Download, ClipboardList, PenTool, Sparkles, AlertCircle, BookTemplate, UserCog, User, Globe, LockKeyhole, FileEdit, Trash2, GraduationCap, Award, Upload, Pencil, Send, Smile, Info, ChevronRight, Activity, Camera, RotateCcw, Building, LogIn, ChevronLeft, ShieldAlert
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

export default function CompanySettings(props: any) {
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
    setIsTemplateModalOpen, startCycleForm, setStartCycleForm, currentCompany, handleOpenAddTeamMember,
    handleOpenAssignManager, isInviteUserModalOpen, inviteForm, setInviteForm, handleSendInvite, seatCount
  } = props;

  return (
    
               <div className="max-w-6xl mx-auto animate-fade-in">
                   <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Company Settings</h2>
                   
                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                       {/* Left Column: Company Info */}
                       <div className="lg:col-span-2">
                           <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 space-y-6">
                               <div className="flex items-center gap-6 mb-8">
                                   <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-3xl">
                                       {currentCompany.name[0]}
                                   </div>
                                   <div>
                                       <h3 className="text-xl font-bold text-slate-900 dark:text-white">{currentCompany.name}</h3>
                                       <p className="text-slate-500">{currentCompany.domain}</p>
                                   </div>
                               </div>
                               
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                   <div>
                                       <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company Name</label>
                                       <input type="text" value={currentCompany.name} readOnly className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-500" />
                                   </div>
                                   <div>
                                       <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Invite Code</label>
                                       <div className="flex gap-2">
                                           <input type="text" value={currentCompany.inviteCode} readOnly className="flex-1 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-mono" />
                                           <button 
                                               onClick={() => {
                                                   navigator.clipboard.writeText(currentCompany.inviteCode);
                                                   alert("Invite code copied to clipboard!");
                                               }}
                                               className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                                               title="Copy to clipboard"
                                           >
                                               <Copy size={18}/>
                                           </button>
                                       </div>
                                   </div>
                                   <div>
                                       <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tax ID</label>
                                       <input type="text" value={currentCompany.taxId} readOnly className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-500" />
                                   </div>
                                   <div>
                                       <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Address</label>
                                       <input type="text" value={currentCompany.address} readOnly className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-500" />
                                   </div>
                               </div>
                           </div>
                       </div>

                       {/* Right Column: Subscription & Billing */}
                       <div className="lg:col-span-1">
                           <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 h-full flex flex-col">
                               <div className="mb-6">
                                   <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                       <CreditCard size={20} className="text-indigo-600 dark:text-indigo-400" /> Subscription
                                   </h3>
                                   <p className="text-sm text-slate-500 mt-1">Manage your plan and seats.</p>
                               </div>

                               <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 mb-6">
                                   <div className="flex justify-between items-center mb-2">
                                       <span className="font-semibold text-slate-900 dark:text-white">{currentCompany.subscriptionPlan}</span>
                                       <span className="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold rounded-full">Active</span>
                                   </div>
                                   <p className="text-xs text-slate-500 dark:text-slate-400">
                                       $13.98/mo base charge.<br/>
                                       Includes 2 Users (1 Admin & 1 Employee).
                                   </p>
                               </div>

                               <div className="space-y-4 mb-6 flex-1">
                                   <div>
                                       <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Total Seats</label>
                                       <div className="flex items-center gap-3">
                                           <button 
                                               onClick={() => setSeatCount(Math.max(2, seatCount - 1))}
                                               className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                                           >
                                               <Minus size={16} />
                                           </button>
                                           <span className="flex-1 text-center font-bold text-xl text-slate-900 dark:text-white">{seatCount}</span>
                                           <button 
                                               onClick={() => setSeatCount(seatCount + 1)}
                                               className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                                           >
                                               <Plus size={16} />
                                           </button>
                                       </div>
                                       <p className="text-xs text-slate-500 mt-2 text-center">Minimum 2 seats required.</p>
                                   </div>

                                   <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2">
                                       <div className="flex justify-between text-sm">
                                           <span className="text-slate-500">Base Plan (2 Users)</span>
                                           <span className="font-medium text-slate-900 dark:text-white">$13.98</span>
                                       </div>
                                       <div className="flex justify-between text-sm">
                                           <span className="text-slate-500">Additional ({Math.max(0, seatCount - 2)}) x $6.99</span>
                                           <span className="font-medium text-slate-900 dark:text-white">${(Math.max(0, seatCount - 2) * 6.99).toFixed(2)}</span>
                                       </div>
                                       <div className="flex justify-between text-base font-bold pt-2 border-t border-slate-100 dark:border-slate-800">
                                           <span className="text-slate-900 dark:text-white">Monthly Total</span>
                                           <span className="text-indigo-600 dark:text-indigo-400">${(13.98 + (Math.max(0, seatCount - 2) * 6.99)).toFixed(2)}</span>
                                       </div>
                                   </div>
                               </div>

                               <button 
                                   onClick={() => {
                                       const total = (13.98 + (Math.max(0, seatCount - 2) * 6.99)).toFixed(2);
                                       alert(`Redirecting to Stripe to update subscription to ${seatCount} seats ($${total}/mo)...`);
                                   }}
                                   className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-900/20 flex items-center justify-center gap-2"
                               >
                                   Update via Stripe <ArrowUpRight size={16} />
                               </button>
                           </div>
                       </div>
                   </div>
               </div>
           
  );
}
