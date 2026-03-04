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

export default function ManageTeam(props: any) {
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
    
               <div className="max-w-7xl mx-auto animate-fade-in">
                   <div className="flex justify-between items-center mb-6">
                       <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Manage Team</h2>
                       <button onClick={() => setIsInviteUserModalOpen(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
                           <UserPlus size={18} /> Invite User
                       </button>
                   </div>
                   
                   <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                       <table className="w-full text-left">
                           <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase text-slate-500">
                               <tr>
                                   <th className="px-6 py-4">User</th>
                                   <th className="px-6 py-4">Role</th>
                                   <th className="px-6 py-4">Title</th>
                                   <th className="px-6 py-4">Manager</th>
                                   <th className="px-6 py-4">Status</th>
                                   <th className="px-6 py-4">Actions</th>
                               </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                               {allUsers.map(u => (
                                   <tr key={u.email} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                       <td className="px-6 py-4">
                                           <div className="flex items-center gap-3">
                                               <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                                                   {u.avatarInitials}
                                               </div>
                                               <div>
                                                   <p className="font-medium text-slate-900 dark:text-white">{u.name}</p>
                                                   <p className="text-xs text-slate-500">{u.email}</p>
                                               </div>
                                           </div>
                                       </td>
                                       <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{u.role}</td>
                                       <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{u.employment?.jobTitle || '-'}</td>
                                       <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                           {u.employment?.managerName ? (
                                               <span className="flex items-center gap-1"><User size={14}/> {u.employment.managerName}</span>
                                           ) : (
                                               <button onClick={() => handleOpenAssignManager(u)} className="text-xs text-indigo-600 hover:underline">Assign Manager</button>
                                           )}
                                       </td>
                                       <td className="px-6 py-4">
                                           <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                                               {u.status || 'Active'}
                                           </span>
                                       </td>
                                       <td className="px-6 py-4">
                                           <button onClick={() => handleOpenAssignManager(u)} className="p-2 text-slate-400 hover:text-indigo-600 rounded">
                                               <UserCog size={18}/>
                                           </button>
                                       </td>
                                   </tr>
                               ))}
                           </tbody>
                       </table>
                   </div>
               </div>
           
  );
}
