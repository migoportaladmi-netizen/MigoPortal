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
    setIsTemplateModalOpen, startCycleForm, setStartCycleForm, generatingItinerary
  } = props;

  return (
    
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
                                                                <FileText size={14}/> {app.cvName || 'Download'}
                                                            </a>
                                                       ) : <span className="text-slate-400 text-xs">No CV</span>}
                                                   </td>
                                                   <td className="px-6 py-4">
                                                       <div className="flex gap-2">
                                                           <button onClick={() => { setSelectedApplication(app); setIsAssignInterviewerModalOpen(true); }} className="p-1.5 text-slate-500 hover:text-indigo-600 bg-slate-100 dark:bg-slate-800 rounded" title="Schedule Interview"><Calendar size={16}/></button>
                                                           <button onClick={() => setConfirmationModal({ isOpen: true, title: 'Hire Candidate', message: `Are you sure you want to hire ${app.applicantName}?`, action: 'hire-candidate', itemId: app.id })} className="p-1.5 text-slate-500 hover:text-green-600 bg-slate-100 dark:bg-slate-800 rounded" title="Hire"><Check size={16}/></button>
                                                           <button onClick={() => setConfirmationModal({ isOpen: true, title: 'Reject Candidate', message: `Reject application for ${app.applicantName}?`, action: 'reject-candidate', itemId: app.id, isDestructive: true })} className="p-1.5 text-slate-500 hover:text-red-600 bg-slate-100 dark:bg-slate-800 rounded" title="Reject"><X size={16}/></button>
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
           
  );
}
