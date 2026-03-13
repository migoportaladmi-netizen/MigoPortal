import React from 'react';
import {
    Plus, Search, Bell, Settings, MoreVertical, Calendar, DollarSign, Plane, FileText, X, Loader2, MapPin, Map as MapIcon, Link as LinkIcon, Building2, Eye, ShieldCheck, ArrowRight, UserPlus, FileStack, LayoutDashboard, Receipt, Clock, Users, Target, Briefcase, Heart, BookOpen, UserCircle, LogOut, Moon, Sun, BriefcaseBusiness, CalendarDays, Check, ListChecks, MessageSquare, Download, ClipboardList, PenTool, Sparkles, AlertCircle, BookTemplate, UserCog, User, Globe, LockKeyhole, FileEdit, Trash2, GraduationCap, Award, Upload, Pencil, Send, Smile, Info, ChevronRight, Activity, Camera, RotateCcw, Building, Save, AlertTriangle, EyeOff
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

export default function SettingsView(props: any) {
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
        setIsSettingModalOpen, setIsManageTeamModalOpen,
        setIsJobModalOpen, setIsApplicationModalOpen, setSelectedJobForApplication,
        setIsInviteUserModalOpen, isDocumentUploadModalOpen, setIsDocumentUploadModalOpen,
        setIsCreateSurveyModalOpen, setIsTakeSurveyModalOpen, setIsSurveyResultsModalOpen,
        setSelectedSurvey, handleUpdateStatus, isReviewModalOpen, handleOpenReviewModal, setIsStartCycleModalOpen,
        setIsTemplateModalOpen, startCycleForm, setStartCycleForm
    } = props;

    // Local state that was previously in App.tsx
    const [activeSettingsTab, setActiveSettingsTab] = React.useState('personal');
    const [isEditingProfile, setIsEditingProfile] = React.useState(false);
    const [editedUser, setEditedUser] = React.useState(user);
    const [showSalary, setShowSalary] = React.useState(false);
    const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = React.useState(false);

    const handleSaveProfile = () => {
        // In a real app this would save to backend/props
        setIsEditingProfile(false);
    };

    return (

        <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">My Profile & Settings</h2>
                {/* Only show edit controls for Personal and Employment tabs */}
                {['personal', 'employment'].includes(activeSettingsTab) && (
                    !isEditingProfile ? (
                        <button onClick={() => { setIsEditingProfile(true); setEditedUser(user); }} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
                            <Pencil size={16} /> Edit Profile
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button onClick={() => { setIsEditingProfile(false); setEditedUser(user); }} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleSaveProfile} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2">
                                <Save size={16} /> Save Changes
                            </button>
                        </div>
                    )
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1 space-y-1">
                    <button onClick={() => { setActiveSettingsTab('personal'); setIsEditingProfile(false); }} className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium ${activeSettingsTab === 'personal' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'}`}>Personal Info</button>
                    <button onClick={() => { setActiveSettingsTab('employment'); setIsEditingProfile(false); }} className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium ${activeSettingsTab === 'employment' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'}`}>Employment</button>
                    <button onClick={() => { setActiveSettingsTab('compensation'); setIsEditingProfile(false); }} className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium ${activeSettingsTab === 'compensation' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'}`}>Compensation</button>
                    <button onClick={() => { setActiveSettingsTab('documents'); setIsEditingProfile(false); }} className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium ${activeSettingsTab === 'documents' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'}`}>Documents</button>
                    <button onClick={() => { setActiveSettingsTab('security'); setIsEditingProfile(false); }} className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium ${activeSettingsTab === 'security' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'}`}>Security</button>
                </div>

                <div className="md:col-span-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
                    {activeSettingsTab === 'personal' && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                                    {editedUser.avatarInitials}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{editedUser.name}</h3>
                                    <p className="text-slate-500">{editedUser.role}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={editedUser.name}
                                        onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                                        readOnly={!isEditingProfile}
                                        className={`w-full p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm text-slate-700 dark:text-slate-300 ${!isEditingProfile ? 'border-none' : 'border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none'}`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Email</label>
                                    <input type="text" value={editedUser.email} readOnly className="w-full p-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed" title="Email cannot be changed" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Phone</label>
                                    <input
                                        type="text"
                                        value={editedUser.phone}
                                        onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                                        readOnly={!isEditingProfile}
                                        className={`w-full p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm text-slate-700 dark:text-slate-300 ${!isEditingProfile ? 'border-none' : 'border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none'}`}
                                    />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                                <h4 className="font-bold mb-4 flex items-center gap-2"><AlertTriangle size={16} /> Emergency Contact</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Name</label>
                                        <input
                                            type="text"
                                            value={editedUser.emergencyContact?.name || ''}
                                            onChange={(e) => setEditedUser({ ...editedUser, emergencyContact: { ...editedUser.emergencyContact || { name: '', relationship: '', phone: '' }, name: e.target.value } })}
                                            readOnly={!isEditingProfile}
                                            className={`w-full p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm text-slate-700 dark:text-slate-300 ${!isEditingProfile ? 'border-none' : 'border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none'}`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Relationship</label>
                                        <input
                                            type="text"
                                            value={editedUser.emergencyContact?.relationship || ''}
                                            onChange={(e) => setEditedUser({ ...editedUser, emergencyContact: { ...editedUser.emergencyContact || { name: '', relationship: '', phone: '' }, relationship: e.target.value } })}
                                            readOnly={!isEditingProfile}
                                            className={`w-full p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm text-slate-700 dark:text-slate-300 ${!isEditingProfile ? 'border-none' : 'border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none'}`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Phone</label>
                                        <input
                                            type="text"
                                            value={editedUser.emergencyContact?.phone || ''}
                                            onChange={(e) => setEditedUser({ ...editedUser, emergencyContact: { ...editedUser.emergencyContact || { name: '', relationship: '', phone: '' }, phone: e.target.value } })}
                                            readOnly={!isEditingProfile}
                                            className={`w-full p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm text-slate-700 dark:text-slate-300 ${!isEditingProfile ? 'border-none' : 'border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none'}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSettingsTab === 'employment' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Job Title</label>
                                    <input
                                        type="text"
                                        value={editedUser.employment?.jobTitle || ''}
                                        onChange={(e) => setEditedUser({ ...editedUser, employment: { ...editedUser.employment!, jobTitle: e.target.value } })}
                                        readOnly={!isEditingProfile}
                                        className={`w-full p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm text-slate-700 dark:text-slate-300 ${!isEditingProfile ? 'border-none' : 'border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none'}`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Department</label>
                                    <input
                                        type="text"
                                        value={editedUser.employment?.department || ''}
                                        onChange={(e) => setEditedUser({ ...editedUser, employment: { ...editedUser.employment!, department: e.target.value } })}
                                        readOnly={!isEditingProfile}
                                        className={`w-full p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm text-slate-700 dark:text-slate-300 ${!isEditingProfile ? 'border-none' : 'border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none'}`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Manager</label>
                                    <input
                                        type="text"
                                        value={editedUser.employment?.managerName || ''}
                                        onChange={(e) => setEditedUser({ ...editedUser, employment: { ...editedUser.employment!, managerName: e.target.value } })}
                                        readOnly={!isEditingProfile}
                                        placeholder="Not Assigned"
                                        className={`w-full p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm text-slate-700 dark:text-slate-300 ${!isEditingProfile ? 'border-none' : 'border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none'}`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        value={editedUser.employment?.startDate || ''}
                                        onChange={(e) => setEditedUser({ ...editedUser, employment: { ...editedUser.employment!, startDate: e.target.value } })}
                                        readOnly={!isEditingProfile}
                                        className={`w-full p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm text-slate-700 dark:text-slate-300 ${!isEditingProfile ? 'border-none' : 'border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none'}`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Location</label>
                                    <input
                                        type="text"
                                        value={editedUser.employment?.location || ''}
                                        onChange={(e) => setEditedUser({ ...editedUser, employment: { ...editedUser.employment!, location: e.target.value } })}
                                        readOnly={!isEditingProfile}
                                        className={`w-full p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm text-slate-700 dark:text-slate-300 ${!isEditingProfile ? 'border-none' : 'border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none'}`}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSettingsTab === 'compensation' && (
                        <div className="space-y-6">
                            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-900/50 flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-medium text-indigo-900 dark:text-indigo-200">Base Salary</p>
                                    <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                                        {showSalary ? `$${user.compensation?.baseSalary.toLocaleString()}` : '••••••'}
                                    </p>
                                </div>
                                <button onClick={() => setShowSalary(!showSalary)} className="p-2 text-indigo-500 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg">
                                    {showSalary ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                            <div>
                                <h4 className="font-bold mb-3 text-sm uppercase text-slate-500">Bonus History</h4>
                                {user.compensation?.bonuses ? (
                                    <div className="space-y-3">
                                        {user.compensation.bonuses.map((bonus, idx) => (
                                            <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm">
                                                <div>
                                                    <p className="font-medium text-slate-900 dark:text-white">{bonus.reason}</p>
                                                    <p className="text-xs text-slate-500">{bonus.date}</p>
                                                </div>
                                                <span className="font-bold text-green-600">+${bonus.amount.toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : <p className="text-sm text-slate-500">No bonus history recorded.</p>}
                            </div>
                        </div>
                    )}

                    {activeSettingsTab === 'documents' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-bold text-slate-900 dark:text-white">Employee Documents</h4>
                                <button onClick={() => setIsDocumentUploadModalOpen(true)} className="text-sm text-indigo-600 hover:underline font-medium">Upload New</button>
                            </div>
                            {user.documents && user.documents.length > 0 ? (
                                <div className="space-y-2">
                                    {user.documents.map(doc => (
                                        <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <FileText size={20} className="text-slate-400" />
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900 dark:text-white">{doc.name}</p>
                                                    <p className="text-xs text-slate-500">{doc.category} • {doc.uploadDate}</p>
                                                </div>
                                            </div>
                                            <button className="text-indigo-600 hover:text-indigo-800 p-2"><Download size={16} /></button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center py-8 text-slate-400 italic">No documents uploaded.</p>
                            )}
                        </div>
                    )}

                    {activeSettingsTab === 'security' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-xl">
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">Password</h4>
                                    <p className="text-sm text-slate-500">Last changed 3 months ago</p>
                                </div>
                                <button onClick={() => setIsResetPasswordModalOpen(true)} className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800">
                                    Reset
                                </button>
                            </div>

                            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                                <button
                                    onClick={() => setConfirmationModal({ isOpen: true, title: 'Log Out', message: 'Are you sure you want to log out?', action: 'logout', itemId: 'logout', isDestructive: true })}
                                    className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
                                >
                                    <LogOut size={20} /> Log Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

    );
}
