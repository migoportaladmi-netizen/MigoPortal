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

export default function Expenses(props: any) {
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
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Expenses</h2>
                      <div className="flex gap-2">
                        <button onClick={() => generateExpensesPDF(expenses)} className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 shadow-sm">
                            <Download size={18} /> Export
                        </button>
                        <button onClick={() => setIsExpenseModalOpen(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-900/30 flex items-center gap-2">
                            <Plus size={18} /> Add Expense
                        </button>
                      </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase text-slate-500 font-medium">
                                <tr>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Merchant</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Tax Deductible</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {expenses.slice(0, visibleExpensesCount).map(expense => (
                                    <tr key={expense.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">{expense.date}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                                            <div className="flex flex-col">
                                                <span>{expense.merchant}</span>
                                                <span className="text-xs text-slate-400 font-normal truncate max-w-[150px]">{expense.description}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                                                {expense.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">${expense.amount.toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            {expense.taxDeductibility && (
                                                <div className="flex items-center gap-1.5">
                                                    <span className={`w-2 h-2 rounded-full ${expense.taxDeductibility === 'Yes' ? 'bg-green-500' : expense.taxDeductibility === 'Partial' ? 'bg-amber-500' : 'bg-red-500'}`}></span>
                                                    <span className="text-sm text-slate-600 dark:text-slate-300">{expense.taxDeductibility}</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                                ${expense.status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                                                  expense.status === 'Rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 
                                                  'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                                                {expense.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.role === 'Administrator' && expense.status === 'Pending' && (
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => setConfirmationModal({ isOpen: true, title: 'Approve Expense', message: 'Are you sure you want to approve this expense?', action: 'approve', itemId: expense.id })} className="p-1 text-green-600 hover:bg-green-50 rounded"><Check size={18}/></button>
                                                    <button onClick={() => setConfirmationModal({ isOpen: true, title: 'Reject Expense', message: 'Are you sure you want to reject this expense?', action: 'reject', itemId: expense.id, isDestructive: true })} className="p-1 text-red-600 hover:bg-red-50 rounded"><X size={18}/></button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                      </div>
                      {expenses.length > visibleExpensesCount && (
                          <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-center">
                              <button onClick={() => setVisibleExpensesCount(prev => prev + 10)} className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">Load More</button>
                          </div>
                      )}
                  </div>
              </div>
           
  );
}
