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

export default function Goals(props: any) {
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
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Goals</h2>
                      <button onClick={() => setIsGoalModalOpen(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-900/30 flex items-center gap-2">
                          <Plus size={18} /> Create Goal
                      </button>
                  </div>

                  {/* My Goals */}
                  <div className="mb-8">
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                          <Target size={20} className="text-indigo-600"/> My Goals
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {goals.filter(g => g.userId === user.email).map(goal => (
                              <div key={goal.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col">
                                  <div className="flex justify-between items-start mb-3">
                                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${goal.type === 'Business' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                          {goal.type}
                                      </span>
                                      <div className="flex items-center gap-2">
                                          {goal.visibility === 'Public' ? <span title="Public"><Globe size={14} className="text-slate-400" /></span> : <span title="Manager Only"><LockKeyhole size={14} className="text-slate-400" /></span>}
                                          <button onClick={() => setConfirmationModal({ isOpen: true, title: 'Delete Goal', message: 'Delete this goal?', action: 'delete-goal', itemId: goal.id, isDestructive: true })} className="text-slate-300 hover:text-red-500"><Trash2 size={16}/></button>
                                      </div>
                                  </div>
                                  <h4 className="font-bold text-slate-900 dark:text-white mb-2">{goal.title}</h4>
                                  <p className="text-sm text-slate-500 mb-4 flex-1">{goal.description}</p>
                                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                                      <Calendar size={14}/> Due: {goal.dueDate}
                                  </div>
                                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                      <span className={`text-xs font-bold ${goal.status === 'Completed' ? 'text-green-600' : goal.status === 'In Progress' ? 'text-amber-600' : 'text-slate-500'}`}>{goal.status}</span>
                                      {goal.status !== 'Completed' && (
                                          <button onClick={() => handleUpdateGoalStatus(goal.id, 'Completed')} className="text-xs font-medium text-indigo-600 hover:underline">Mark Complete</button>
                                      )}
                                  </div>
                              </div>
                          ))}
                          {goals.filter(g => g.userId === user.email).length === 0 && (
                              <div className="col-span-3 text-center py-8 text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                                  No goals set yet. Create one to get started!
                              </div>
                          )}
                      </div>
                  </div>

                  {/* Company/Team Goals (Visible to me) */}
                  <div>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                          <Users size={20} className="text-indigo-600"/> Team & Company Goals
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {goals.filter(g => {
                              if (g.userId === user.email) return false; // Already shown in My Goals
                              if (g.visibility === 'Public') return true; // Show all public
                              // If manager visibility, show only if I am their manager
                              if (g.visibility === 'Manager') {
                                  const owner = allUsers.find(u => u.email === g.userId);
                                  return owner?.employment?.managerEmail === user.email || user.role === 'Administrator';
                              }
                              return false;
                          }).map(goal => (
                              <div key={goal.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col opacity-90">
                                  <div className="flex justify-between items-start mb-3">
                                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${goal.type === 'Business' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                          {goal.type}
                                      </span>
                                      <div className="flex items-center gap-1 text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                                          <User size={12}/> {goal.userName}
                                      </div>
                                  </div>
                                  <h4 className="font-bold text-slate-900 dark:text-white mb-2">{goal.title}</h4>
                                  <p className="text-sm text-slate-500 mb-4 flex-1">{goal.description}</p>
                                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                      <span className={`text-xs font-bold ${goal.status === 'Completed' ? 'text-green-600' : goal.status === 'In Progress' ? 'text-amber-600' : 'text-slate-500'}`}>{goal.status}</span>
                                      <div className="flex items-center gap-2">
                                        {goal.visibility === 'Public' ? <Globe size={14} className="text-slate-300"/> : <LockKeyhole size={14} className="text-slate-300"/>}
                                      </div>
                                  </div>
                              </div>
                          ))}
                           {goals.filter(g => {
                              if (g.userId === user.email) return false;
                              if (g.visibility === 'Public') return true;
                              if (g.visibility === 'Manager') {
                                  const owner = allUsers.find(u => u.email === g.userId);
                                  return owner?.employment?.managerEmail === user.email || user.role === 'Administrator';
                              }
                              return false;
                          }).length === 0 && (
                              <div className="col-span-3 text-center py-8 text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                                  No visible goals from others.
                              </div>
                          )}
                      </div>
                  </div>
              </div>
           
  );
}
