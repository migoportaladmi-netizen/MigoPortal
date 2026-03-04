import React from 'react';
import {
    Plus, Search, Bell, Settings, MoreVertical, Calendar, DollarSign, Plane, FileText, X, Loader2, MapPin, Map as MapIcon, Link as LinkIcon, Building2, Eye, ShieldCheck, ArrowRight, UserPlus, FileStack, LayoutDashboard, Receipt, Clock, Users, Target, Briefcase, Heart, BookOpen, UserCircle, LogOut, Moon, Sun, BriefcaseBusiness, CalendarDays, Check, ListChecks, MessageSquare, Download, ClipboardList, PenTool, Sparkles, AlertCircle, BookTemplate, UserCog, User, Globe, LockKeyhole, FileEdit, Trash2, GraduationCap, Award, Upload, Pencil, Send, Smile, Info, ChevronRight, Activity, Camera, RotateCcw, Building, LogIn, ChevronLeft, ShieldAlert, Mail, MoreHorizontal
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

export default function MyTeam(props: any) {
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
        handleOpenAssignManager, isInviteUserModalOpen, inviteForm, setInviteForm, handleSendInvite, seatCount,
        setSelectedTeamMemberProfile, setIsTeamMemberProfileModalOpen
    } = props;

    return (

        <div className="max-w-7xl mx-auto animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">My Team</h2>
                <button onClick={handleOpenAddTeamMember} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
                    <UserPlus size={18} /> Add Member
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myTeam.map(member => (
                    <div key={member.email} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center text-center relative group">
                        <button onClick={() => setConfirmationModal({ isOpen: true, title: 'Remove Member', message: `Remove ${member.name} from your team?`, action: 'remove-team-member', itemId: member.email, isDestructive: true })} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            <X size={18} />
                        </button>
                        <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                            {member.avatarInitials}
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">{member.name}</h3>
                        <p className="text-sm text-slate-500 mb-1">{member.employment?.jobTitle}</p>
                        <p className="text-xs text-slate-400 mb-4">{member.email}</p>

                        <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-800 mt-auto flex gap-2">
                            <button onClick={() => { setSelectedTeamMemberProfile(member); setIsTeamMemberProfileModalOpen(true); }} className="flex-1 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
                                View Profile
                            </button>
                            <a href={`mailto:${member.email}`} className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg">
                                <Mail size={18} />
                            </a>
                        </div>
                    </div>
                ))}
                {myTeam.length === 0 && (
                    <div className="col-span-3 text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                        <Users size={48} className="mx-auto text-slate-300 mb-4" />
                        <p className="text-slate-500">You don't have any direct reports yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
