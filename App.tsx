import React, { useState, useEffect, useRef, Suspense } from 'react';
import {
    LayoutDashboard, Receipt, Map as MapIcon, Plus, Search, Bell, Settings, MoreVertical, Calendar,
    DollarSign, Plane, FileText, X, Loader2, MapPin, Briefcase, ShieldCheck, ShieldAlert, Menu,
    Moon, Sun, Pencil, Trash2, Download, User, Mail, Phone, Shield, Lock, LogOut, Save, Check,
    ChevronDown, Camera, ArrowRight, Eye, EyeOff, ArrowLeft, UserCog, UserCheck, Users, Clock,
    CalendarDays, Timer, CheckCircle2, XCircle, BriefcaseBusiness, Award, Heart, Star, ThumbsUp,
    ClipboardList, BarChart2, Upload, File, UserPlus, Building2, Copy, CreditCard, ThumbsDown,
    Minus, Send, UserMinus, MessageSquare, ArrowUpRight, Info, AlertTriangle, FileStack,
    BookTemplate, Target, Globe, LockKeyhole
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

import {
    ViewState, UserProfile, AbsenceType, Goal
} from './types.ts';
import {
    MOCK_USERS, MOCK_COMPANY
} from './constants.ts';
import { generateExpensesPDF, generateItineraryPDF } from './services/pdfService';

// Components
import DashboardStats from './components/DashboardStats.tsx';
import ReceiptUploader from './components/ReceiptUploader.tsx';
import LandingPage from './components/LandingPage.tsx';
import AuthScreen from './components/Auth/AuthScreen.tsx';
import ConfirmationModal from './components/Modals/ConfirmationModal.tsx';
import MarkdownRenderer from './components/MarkdownRenderer';

// Hooks
import { useAppTheme } from './hooks/useAppTheme';
import { useAppAuth } from './hooks/useAppAuth';
import { useAppModals } from './hooks/useAppModals';
import { useAppData } from './hooks/useAppData';

// Lazy loaded features
const Dashboard = React.lazy(() => import('./features/Dashboard/Dashboard'));
const Expenses = React.lazy(() => import('./features/Expenses/Expenses'));
const Trips = React.lazy(() => import('./features/Trips/Trips'));
const TimeAndAbsence = React.lazy(() => import('./features/TimeAndAbsence/TimeAndAbsence'));
const Attendance = React.lazy(() => import('./features/Attendance/Attendance'));
const Absence = React.lazy(() => import('./features/Absence/Absence'));
const MyTeam = React.lazy(() => import('./features/MyTeam/MyTeam'));
const Goals = React.lazy(() => import('./features/Goals/Goals'));
const Jobs = React.lazy(() => import('./features/Jobs/Jobs'));
const Recognition = React.lazy(() => import('./features/Recognition/Recognition'));
const Reviews = React.lazy(() => import('./features/Reviews/Reviews'));
const Surveys = React.lazy(() => import('./features/Surveys/Surveys'));
const Recruitment = React.lazy(() => import('./features/Recruitment/Recruitment'));
const ManageTeam = React.lazy(() => import('./features/Admin/ManageTeam'));
const CompanySettings = React.lazy(() => import('./features/Admin/CompanySettings'));
const SettingsView = React.lazy(() => import('./features/Admin/Settings'));
const Payroll = React.lazy(() => import('./features/Payroll/Payroll'));

export default function App() {
    const [view, setView] = useState<ViewState>('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Custom Hooks
    const { isDarkMode, toggleTheme } = useAppTheme();
    const {
        isAuthenticated, showLandingPage, authMode, user, setUser,
        handleLogin, handleLogout, navigateToAuth, handleBackToLanding
    } = useAppAuth(MOCK_COMPANY);
    const modals = useAppModals();
    const data = useAppData(user, setUser);

    // Filter Absence/Time Requests for Managers/Admins
    const myTeam = data.allUsers.filter(u => u.employment?.managerEmail === user.email);
    const isManager = myTeam.length > 0 || user.role === 'Administrator';

    const teamAbsenceRequests = user.role === 'Administrator'
        ? data.absenceRequests
        : data.absenceRequests.filter(req => myTeam.some(member => member.email === req.userId));

    const teamTimeEntries = user.role === 'Administrator'
        ? data.timeEntries
        : data.timeEntries.filter(entry => myTeam.some(member => member.email === entry.userId));

    // Handle authentication screens
    if (!showLandingPage && !isAuthenticated) {
        return <AuthScreen
            onLogin={handleLogin}
            onBack={handleBackToLanding}
            availableUsers={MOCK_USERS}
            company={MOCK_COMPANY}
            initialIsSignUp={authMode === 'signup'}
        />;
    }

    if (showLandingPage) {
        return <LandingPage onNavigateToAuth={navigateToAuth} />;
    }

    // Props bundle for feature components
    const appProps = {
        user, ...data, ...modals,
        setView, myTeam, isManager, teamAbsenceRequests, teamTimeEntries,
        isDarkMode, toggleTheme, isMobileMenuOpen, setIsMobileMenuOpen,
        currentCompany: MOCK_COMPANY,
        generateExpensesPDF, generateItineraryPDF,
        handleOpenAddTeamMember: () => {
            modals.setInviteForm({ name: '', email: '', role: 'Employee', jobTitle: '', department: '' });
            modals.setIsInviteUserModalOpen(true);
        },
        handleConfirmationAction: () => {
            // We'll call the actual handler in the ConfirmationModal onConfirm
        }
    };

    const renderSidebar = () => (
        <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static`}>
            {/* Sidebar implementation */}
            <div className="flex flex-col h-full">
                <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-800">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-900/50">M</div>
                    <span className="font-bold text-xl tracking-wide">MigoPortal</span>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                    <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Main</p>
                    <button onClick={() => { setView('dashboard'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                        <LayoutDashboard size={20} />
                        <span className="font-medium">Dashboard</span>
                    </button>
                    <button onClick={() => { setView('expenses'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'expenses' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                        <Receipt size={20} />
                        <span className="font-medium">Expenses</span>
                    </button>
                    <button onClick={() => { setView('trips'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'trips' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                        <MapIcon size={20} />
                        <span className="font-medium">Trips</span>
                    </button>
                    <button onClick={() => { setView('attendance'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'attendance' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                        <Clock size={20} />
                        <span className="font-medium">Attendance</span>
                    </button>
                    <button onClick={() => { setView('absence'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'absence' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                        <CalendarDays size={20} />
                        <span className="font-medium">Absence</span>
                    </button>
                    <button onClick={() => { setView('payroll'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'payroll' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                        <DollarSign size={20} />
                        <span className="font-medium">Payroll</span>
                    </button>
                    <button onClick={() => { setView('my-team'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'my-team' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                        <Users size={20} />
                        <span className="font-medium">My Team</span>
                    </button>

                    <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-6 mb-2">People & Culture</p>
                    <button onClick={() => { setView('goals'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'goals' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                        <Target size={20} />
                        <span className="font-medium">Goals</span>
                    </button>
                    <button onClick={() => { setView('jobs'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'jobs' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                        <Briefcase size={20} />
                        <span className="font-medium">Jobs</span>
                    </button>
                    <button onClick={() => { setView('recognition'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'recognition' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                        <Heart size={20} />
                        <span className="font-medium">Recognition</span>
                    </button>
                    <button onClick={() => { setView('reviews'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'reviews' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                        <FileStack size={20} />
                        <span className="font-medium">Reviews</span>
                    </button>
                    <button onClick={() => { setView('surveys'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'surveys' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                        <ClipboardList size={20} />
                        <span className="font-medium">Surveys</span>
                    </button>
                    <button onClick={() => { setView('recruitment'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'recruitment' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                        <UserPlus size={20} />
                        <span className="font-medium">Recruitment</span>
                    </button>

                    {user.role === 'Administrator' && (
                        <>
                            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-6 mb-2">Admin</p>
                            <button onClick={() => { setView('team'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'team' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                                <UserCog size={20} />
                                <span className="font-medium">Manage Team</span>
                            </button>
                            <button onClick={() => { setView('company-settings'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'company-settings' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                                <Building2 size={20} />
                                <span className="font-medium">Company</span>
                            </button>
                        </>
                    )}
                </div>

                <div className="p-4 border-t border-slate-800">
                    <button onClick={() => { setView('settings'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'settings' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold">
                            {user.avatarInitials}
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-sm font-medium truncate">{user.name}</p>
                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        </div>
                        <Settings size={18} />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex h-dvh overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            {renderSidebar()}

            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            )}

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-4 sm:px-6 z-20">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                            <Menu size={24} />
                        </button>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white capitalize truncate">{view.replace('-', ' ')}</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={toggleTheme} className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 space-y-8">
                    <Suspense fallback={<div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-indigo-600" /></div>}>
                        {view === 'dashboard' && <Dashboard {...appProps} />}
                        {view === 'expenses' && <Expenses {...appProps} />}
                        {view === 'trips' && <Trips {...appProps} />}
                        {view === 'attendance' && <Attendance {...appProps} />}
                        {view === 'absence' && <Absence {...appProps} />}
                        {view === 'time-absence' && <TimeAndAbsence {...appProps} />}
                        {view === 'my-team' && <MyTeam {...appProps} />}
                        {view === 'goals' && <Goals {...appProps} />}
                        {view === 'jobs' && <Jobs {...appProps} />}
                        {view === 'recognition' && <Recognition {...appProps} />}
                        {view === 'reviews' && <Reviews {...appProps} />}
                        {view === 'surveys' && <Surveys {...appProps} />}
                        {view === 'recruitment' && <Recruitment {...appProps} />}
                        {view === 'team' && <ManageTeam {...appProps} />}
                        {view === 'company-settings' && <CompanySettings {...appProps} />}
                        {view === 'settings' && <SettingsView {...appProps} />}
                        {view === 'payroll' && <Payroll {...appProps} />}
                    </Suspense>
                </main>
            </div>

            <ConfirmationModal
                isOpen={modals.confirmationModal.isOpen}
                title={modals.confirmationModal.title}
                message={modals.confirmationModal.message}
                isDestructive={modals.confirmationModal.isDestructive}
                onConfirm={() => {
                    const { action, itemId } = modals.confirmationModal;
                    if (action === 'logout') handleLogout();
                    else if (action === 'approve' && itemId) data.setExpenses(prev => prev.map(e => e.id === itemId ? { ...e, status: 'Approved' } : e));
                    else if (action === 'reject' && itemId) data.setExpenses(prev => prev.map(e => e.id === itemId ? { ...e, status: 'Rejected' } : e));
                    else if (action === 'approve-absence' && itemId) data.setAbsenceRequests(prev => prev.map(a => a.id === itemId ? { ...a, status: 'Approved' } : a));
                    else if (action === 'reject-absence' && itemId) data.setAbsenceRequests(prev => prev.map(a => a.id === itemId ? { ...a, status: 'Rejected' } : a));
                    else if (action === 'approve-time' && itemId) data.setTimeEntries(prev => prev.map(t => t.id === itemId ? { ...t, status: 'Approved' } : t));
                    else if (action === 'reject-time' && itemId) data.setTimeEntries(prev => prev.map(t => t.id === itemId ? { ...t, status: 'Rejected' } : t));
                    else if (action === 'delete-job' && itemId) data.setJobs(prev => prev.filter(j => j.id !== itemId));
                    else if (action === 'delete-survey' && itemId) data.setSurveys(prev => prev.filter(s => s.id !== itemId));
                    else if (action === 'remove-team-member' && itemId) data.handleRemoveTeamMember(itemId, () => { });
                    else if (action === 'hire-candidate' && itemId) data.handleUpdateStatus(itemId, 'Hired');
                    else if (action === 'reject-candidate' && itemId) data.handleUpdateStatus(itemId, 'Rejected');
                    else if (action === 'delete-time-entry' && itemId) data.setTimeEntries(prev => prev.filter(t => t.id !== itemId));
                    else if (action === 'delete-absence-request' && itemId) data.setAbsenceRequests(prev => prev.filter(a => a.id !== itemId));
                    else if (action === 'delete-goal' && itemId) data.setGoals(prev => prev.filter(g => g.id !== itemId));
                    modals.setConfirmationModal(prev => ({ ...prev, isOpen: false }));
                }}
                onCancel={() => modals.setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
            />

            {/* ── Add Expense Modal ── */}
            {modals.isExpenseModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Add Expense">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => modals.setIsExpenseModalOpen(false)} />
                    <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-700 animate-fade-in">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl"><Receipt size={18} className="text-indigo-600 dark:text-indigo-400" /></div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Add Expense</h2>
                            </div>
                            <button onClick={() => modals.setIsExpenseModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"><X size={18} /></button>
                        </div>

                        {/* Form */}
                        <form
                            onSubmit={e => {
                                e.preventDefault();
                                data.handleSaveManualExpense(modals.newManualExpense, () => {
                                    modals.setIsExpenseModalOpen(false);
                                    modals.setNewManualExpense({
                                        date: new Date().toISOString().split('T')[0],
                                        currency: 'USD', category: 'Other',
                                        merchant: '', amount: 0, description: ''
                                    });
                                });
                            }}
                            className="p-6 space-y-4"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Merchant / Vendor <span className="text-red-500">*</span></label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Starbucks, Delta Airlines"
                                        value={modals.newManualExpense.merchant || ''}
                                        onChange={e => modals.setNewManualExpense(p => ({ ...p, merchant: e.target.value }))}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Amount <span className="text-red-500">*</span></label>
                                    <input
                                        required
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={modals.newManualExpense.amount || ''}
                                        onChange={e => modals.setNewManualExpense(p => ({ ...p, amount: parseFloat(e.target.value) || 0 }))}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Currency</label>
                                    <select
                                        value={modals.newManualExpense.currency || 'USD'}
                                        onChange={e => modals.setNewManualExpense(p => ({ ...p, currency: e.target.value }))}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                                    >
                                        {['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF'].map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Date <span className="text-red-500">*</span></label>
                                    <input
                                        required
                                        type="date"
                                        value={modals.newManualExpense.date || new Date().toISOString().split('T')[0]}
                                        onChange={e => modals.setNewManualExpense(p => ({ ...p, date: e.target.value }))}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Category</label>
                                    <select
                                        value={modals.newManualExpense.category || 'Other'}
                                        onChange={e => modals.setNewManualExpense(p => ({ ...p, category: e.target.value as any }))}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                                    >
                                        {['Travel', 'Meals', 'Lodging', 'Office Supplies', 'Software', 'Entertainment', 'Other'].map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Optional notes about this expense..."
                                        value={modals.newManualExpense.description || ''}
                                        onChange={e => modals.setNewManualExpense(p => ({ ...p, description: e.target.value }))}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm resize-none"
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => modals.setIsExpenseModalOpen(false)} className="flex-1 py-2.5 text-slate-600 dark:text-slate-300 font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors text-sm">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-900/20 text-sm">
                                    Submit Expense
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Plan New Trip Modal ── */}
            {modals.isTripModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Plan New Trip">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { modals.setIsTripModalOpen(false); modals.setEditingTripId(null); }} />
                    <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-700 animate-fade-in">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl"><Plane size={18} className="text-indigo-600 dark:text-indigo-400" /></div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{modals.editingTripId ? 'Edit Trip' : 'Plan New Trip'}</h2>
                            </div>
                            <button onClick={() => { modals.setIsTripModalOpen(false); modals.setEditingTripId(null); }} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"><X size={18} /></button>
                        </div>

                        {/* Form */}
                        <form
                            onSubmit={e => {
                                e.preventDefault();
                                data.handleSaveTrip(modals.newTrip, modals.editingTripId, () => {
                                    modals.setIsTripModalOpen(false);
                                    modals.setEditingTripId(null);
                                    modals.setNewTrip({
                                        destination: '', purpose: '',
                                        startDate: new Date().toISOString().split('T')[0],
                                        endDate: new Date().toISOString().split('T')[0],
                                        budget: 0, status: 'Planned'
                                    });
                                });
                            }}
                            className="p-6 space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Destination <span className="text-red-500">*</span></label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. New York, London, Tokyo"
                                    value={modals.newTrip.destination || ''}
                                    onChange={e => modals.setNewTrip(p => ({ ...p, destination: e.target.value }))}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Purpose <span className="text-red-500">*</span></label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. Client Meeting, Conference, Training"
                                    value={modals.newTrip.purpose || ''}
                                    onChange={e => modals.setNewTrip(p => ({ ...p, purpose: e.target.value }))}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Start Date <span className="text-red-500">*</span></label>
                                    <input
                                        required
                                        type="date"
                                        value={modals.newTrip.startDate || new Date().toISOString().split('T')[0]}
                                        onChange={e => modals.setNewTrip(p => ({ ...p, startDate: e.target.value }))}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">End Date <span className="text-red-500">*</span></label>
                                    <input
                                        required
                                        type="date"
                                        value={modals.newTrip.endDate || new Date().toISOString().split('T')[0]}
                                        onChange={e => modals.setNewTrip(p => ({ ...p, endDate: e.target.value }))}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Budget (USD)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="1"
                                        placeholder="0"
                                        value={modals.newTrip.budget || ''}
                                        onChange={e => modals.setNewTrip(p => ({ ...p, budget: parseFloat(e.target.value) || 0 }))}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Status</label>
                                    <select
                                        value={modals.newTrip.status || 'Planned'}
                                        onChange={e => modals.setNewTrip(p => ({ ...p, status: e.target.value as any }))}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                                    >
                                        <option value="Planned">Planned</option>
                                        <option value="Active">Active</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => { modals.setIsTripModalOpen(false); modals.setEditingTripId(null); }} className="flex-1 py-2.5 text-slate-600 dark:text-slate-300 font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors text-sm">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-900/20 text-sm">
                                    {modals.editingTripId ? 'Save Changes' : 'Create Trip'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Log Time Modal ── */}
            {modals.isTimeModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Log Time">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => modals.setIsTimeModalOpen(false)} />
                    <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-700 animate-fade-in">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl"><Clock size={18} className="text-indigo-600 dark:text-indigo-400" /></div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Log Time</h2>
                            </div>
                            <button onClick={() => modals.setIsTimeModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"><X size={18} /></button>
                        </div>
                        <form
                            onSubmit={e => {
                                e.preventDefault();
                                data.handleSaveTimeEntry(modals.newTimeEntry, () => {
                                    modals.setIsTimeModalOpen(false);
                                    modals.setNewTimeEntry({ date: new Date().toISOString().split('T')[0], startTime: '09:00', endTime: '17:00', description: '', breakMinutes: 0 });
                                });
                            }}
                            className="p-6 space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Date <span className="text-red-500">*</span></label>
                                <input required type="date" value={modals.newTimeEntry.date || new Date().toISOString().split('T')[0]} onChange={e => modals.setNewTimeEntry(p => ({ ...p, date: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Start Time <span className="text-red-500">*</span></label>
                                    <input required type="time" value={modals.newTimeEntry.startTime || '09:00'} onChange={e => modals.setNewTimeEntry(p => ({ ...p, startTime: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">End Time <span className="text-red-500">*</span></label>
                                    <input required type="time" value={modals.newTimeEntry.endTime || '17:00'} onChange={e => modals.setNewTimeEntry(p => ({ ...p, endTime: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Break (minutes)</label>
                                <input type="number" min="0" step="5" placeholder="0" value={modals.newTimeEntry.breakMinutes || ''} onChange={e => modals.setNewTimeEntry(p => ({ ...p, breakMinutes: parseInt(e.target.value) || 0 }))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description / Task</label>
                                <textarea rows={3} placeholder="What did you work on?" value={modals.newTimeEntry.description || ''} onChange={e => modals.setNewTimeEntry(p => ({ ...p, description: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none" />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => modals.setIsTimeModalOpen(false)} className="flex-1 py-2.5 text-slate-600 dark:text-slate-300 font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors text-sm">Cancel</button>
                                <button type="submit" className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-900/20 text-sm">Log Time</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Request Leave Modal ── */}
            {modals.isAbsenceModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Request Leave">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => modals.setIsAbsenceModalOpen(false)} />
                    <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-700 animate-fade-in">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl"><CalendarDays size={18} className="text-indigo-600 dark:text-indigo-400" /></div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Request Leave</h2>
                            </div>
                            <button onClick={() => modals.setIsAbsenceModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"><X size={18} /></button>
                        </div>
                        <form
                            onSubmit={e => {
                                e.preventDefault();
                                data.handleSaveAbsence(modals.newAbsence, () => {
                                    modals.setIsAbsenceModalOpen(false);
                                    modals.setNewAbsence({ startDate: new Date().toISOString().split('T')[0], endDate: new Date().toISOString().split('T')[0], type: 'Vacation' as any, reason: '' });
                                });
                            }}
                            className="p-6 space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Leave Type <span className="text-red-500">*</span></label>
                                <select required value={modals.newAbsence.type || 'Vacation'} onChange={e => modals.setNewAbsence(p => ({ ...p, type: e.target.value as any }))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm">
                                    <option value="Vacation">Vacation</option>
                                    <option value="Sick Leave">Sick Leave</option>
                                    <option value="Personal">Personal</option>
                                    <option value="Remote Work">Remote Work</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Start Date <span className="text-red-500">*</span></label>
                                    <input required type="date" value={modals.newAbsence.startDate || new Date().toISOString().split('T')[0]} onChange={e => modals.setNewAbsence(p => ({ ...p, startDate: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">End Date <span className="text-red-500">*</span></label>
                                    <input required type="date" value={modals.newAbsence.endDate || new Date().toISOString().split('T')[0]} onChange={e => modals.setNewAbsence(p => ({ ...p, endDate: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Reason</label>
                                <textarea rows={3} placeholder="Briefly describe the reason for your leave..." value={modals.newAbsence.reason || ''} onChange={e => modals.setNewAbsence(p => ({ ...p, reason: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none" />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => modals.setIsAbsenceModalOpen(false)} className="flex-1 py-2.5 text-slate-600 dark:text-slate-300 font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors text-sm">Cancel</button>
                                <button type="submit" className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-900/20 text-sm">Submit Request</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Invite / Add Member Modal ── */}
            {modals.isInviteUserModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Add Team Member">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => modals.setIsInviteUserModalOpen(false)} />
                    <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-700 animate-fade-in">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl"><UserPlus size={18} className="text-indigo-600 dark:text-indigo-400" /></div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Add Team Member</h2>
                            </div>
                            <button onClick={() => modals.setIsInviteUserModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"><X size={18} /></button>
                        </div>
                        <form
                            onSubmit={e => {
                                e.preventDefault();
                                data.handleSendInvite(modals.inviteForm, () => {
                                    modals.setIsInviteUserModalOpen(false);
                                    modals.setInviteForm({ name: '', email: '', role: 'Employee', jobTitle: '', department: '' });
                                });
                            }}
                            className="p-6 space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                                <input required type="text" placeholder="e.g. Jane Smith" value={modals.inviteForm.name || ''} onChange={e => modals.setInviteForm((p: any) => ({ ...p, name: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Work Email <span className="text-red-500">*</span></label>
                                <input required type="email" placeholder="e.g. jane@company.com" value={modals.inviteForm.email || ''} onChange={e => modals.setInviteForm((p: any) => ({ ...p, email: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Role</label>
                                    <select value={modals.inviteForm.role || 'Employee'} onChange={e => modals.setInviteForm((p: any) => ({ ...p, role: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm">
                                        <option value="Employee">Employee</option>
                                        <option value="Manager">Manager</option>
                                        <option value="Administrator">Administrator</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Department</label>
                                    <input type="text" placeholder="e.g. Engineering" value={modals.inviteForm.department || ''} onChange={e => modals.setInviteForm((p: any) => ({ ...p, department: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Job Title</label>
                                <input type="text" placeholder="e.g. Senior Engineer" value={modals.inviteForm.jobTitle || ''} onChange={e => modals.setInviteForm((p: any) => ({ ...p, jobTitle: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => modals.setIsInviteUserModalOpen(false)} className="flex-1 py-2.5 text-slate-600 dark:text-slate-300 font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors text-sm">Cancel</button>
                                <button type="submit" className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-900/20 text-sm">Send Invite</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Create / Edit Goal Modal ── */}
            {modals.isGoalModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Create Goal">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => modals.setIsGoalModalOpen(false)} />
                    <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-700 animate-fade-in">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl"><Target size={18} className="text-indigo-600 dark:text-indigo-400" /></div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Create Goal</h2>
                            </div>
                            <button onClick={() => modals.setIsGoalModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"><X size={18} /></button>
                        </div>
                        <form
                            onSubmit={e => {
                                e.preventDefault();
                                data.handleSaveGoal(modals.newGoal, () => {
                                    modals.setIsGoalModalOpen(false);
                                    modals.setNewGoal({ title: '', description: '', type: 'Business', visibility: 'Manager', status: 'Not Started', dueDate: '' });
                                });
                            }}
                            className="p-6 space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Goal Title <span className="text-red-500">*</span></label>
                                <input required type="text" placeholder="e.g. Increase team velocity by 20%" value={modals.newGoal.title || ''} onChange={e => modals.setNewGoal((p: any) => ({ ...p, title: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
                                <textarea rows={3} placeholder="Describe the goal and how success will be measured..." value={modals.newGoal.description || ''} onChange={e => modals.setNewGoal((p: any) => ({ ...p, description: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Type</label>
                                    <select value={modals.newGoal.type || 'Business'} onChange={e => modals.setNewGoal((p: any) => ({ ...p, type: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm">
                                        <option value="Business">Business</option>
                                        <option value="Personal">Personal</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Visibility</label>
                                    <select value={modals.newGoal.visibility || 'Manager'} onChange={e => modals.setNewGoal((p: any) => ({ ...p, visibility: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm">
                                        <option value="Manager">Manager only</option>
                                        <option value="Public">Public</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Due Date <span className="text-red-500">*</span></label>
                                <input required type="date" value={modals.newGoal.dueDate || ''} onChange={e => modals.setNewGoal((p: any) => ({ ...p, dueDate: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => modals.setIsGoalModalOpen(false)} className="flex-1 py-2.5 text-slate-600 dark:text-slate-300 font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors text-sm">Cancel</button>
                                <button type="submit" className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-900/20 text-sm">Create Goal</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Post New Job Modal ── */}
            {modals.isJobModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Post New Job">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { modals.setIsJobModalOpen(false); modals.setEditingJobId(null); }} />
                    <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-700 animate-fade-in max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl"><Briefcase size={18} className="text-indigo-600 dark:text-indigo-400" /></div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{modals.editingJobId ? 'Edit Job' : 'Post New Job'}</h2>
                            </div>
                            <button onClick={() => { modals.setIsJobModalOpen(false); modals.setEditingJobId(null); }} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"><X size={18} /></button>
                        </div>
                        <form
                            onSubmit={e => {
                                e.preventDefault();
                                data.handleSaveJob(modals.newJob, modals.editingJobId, () => {
                                    modals.setIsJobModalOpen(false);
                                    modals.setEditingJobId(null);
                                    modals.setNewJob({ title: '', department: '', location: '', type: 'Full-time', salaryRange: '', description: '', status: 'Open' });
                                });
                            }}
                            className="p-6 space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Job Title <span className="text-red-500">*</span></label>
                                <input required type="text" placeholder="e.g. Senior Software Engineer" value={modals.newJob.title || ''} onChange={e => modals.setNewJob((p: any) => ({ ...p, title: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Department</label>
                                    <input type="text" placeholder="e.g. Engineering" value={modals.newJob.department || ''} onChange={e => modals.setNewJob((p: any) => ({ ...p, department: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Location</label>
                                    <input type="text" placeholder="e.g. Remote, New York" value={modals.newJob.location || ''} onChange={e => modals.setNewJob((p: any) => ({ ...p, location: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Employment Type</label>
                                    <select value={modals.newJob.type || 'Full-time'} onChange={e => modals.setNewJob((p: any) => ({ ...p, type: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm">
                                        <option value="Full-time">Full-time</option>
                                        <option value="Part-time">Part-time</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Remote">Remote</option>
                                        <option value="Internship">Internship</option>
                                        <option value="Working Student">Working Student</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Salary Range</label>
                                    <input type="text" placeholder="e.g. $80k – $120k" value={modals.newJob.salaryRange || ''} onChange={e => modals.setNewJob((p: any) => ({ ...p, salaryRange: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Job Description <span className="text-red-500">*</span></label>
                                <textarea required rows={5} placeholder="Describe the role, responsibilities, and requirements..." value={modals.newJob.description || ''} onChange={e => modals.setNewJob((p: any) => ({ ...p, description: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Status</label>
                                <select value={modals.newJob.status || 'Open'} onChange={e => modals.setNewJob((p: any) => ({ ...p, status: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm">
                                    <option value="Open">Open</option>
                                    <option value="Closed">Closed</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => { modals.setIsJobModalOpen(false); modals.setEditingJobId(null); }} className="flex-1 py-2.5 text-slate-600 dark:text-slate-300 font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors text-sm">Cancel</button>
                                <button type="submit" className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-900/20 text-sm">{modals.editingJobId ? 'Save Changes' : 'Post Job'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Send Praise Modal ── */}
            {modals.isPraiseModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Send Praise">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => modals.setIsPraiseModalOpen(false)} />
                    <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-700 animate-fade-in max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-pink-50 dark:bg-pink-900/30 rounded-xl"><Heart size={18} className="text-pink-600 dark:text-pink-400" /></div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Send Praise</h2>
                            </div>
                            <button onClick={() => modals.setIsPraiseModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"><X size={18} /></button>
                        </div>
                        <form
                            onSubmit={e => {
                                e.preventDefault();
                                data.handleSavePraise(modals.newPraise, () => {
                                    modals.setIsPraiseModalOpen(false);
                                    modals.setNewPraise({ toUserEmail: '', message: '', category: 'Teamwork' });
                                });
                            }}
                            className="p-6 space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Recipient <span className="text-red-500">*</span></label>
                                <select
                                    required
                                    value={modals.newPraise.toUserEmail || ''}
                                    onChange={e => modals.setNewPraise((p: any) => ({ ...p, toUserEmail: e.target.value }))}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-pink-500 outline-none text-sm"
                                >
                                    <option value="" disabled>Select a colleague</option>
                                    {data.allUsers.filter((u: any) => u.email !== user.email).map((u: any) => (
                                        <option key={u.email} value={u.email}>{u.name} ({u.email})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Category <span className="text-red-500">*</span></label>
                                <div className="grid grid-cols-2 gap-3">
                                    {(['Teamwork', 'Innovation', 'Leadership', 'Dedication', 'Helpful'] as const).map(cat => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => modals.setNewPraise((p: any) => ({ ...p, category: cat }))}
                                            className={`px-4 py-2 rounded-xl border text-xs font-medium transition-all ${modals.newPraise.category === cat
                                                    ? 'bg-pink-100 border-pink-200 text-pink-700 dark:bg-pink-900/40 dark:border-pink-800 dark:text-pink-300'
                                                    : 'bg-slate-50 border-slate-100 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 hover:bg-slate-100'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Message <span className="text-red-500">*</span></label>
                                <textarea required rows={4} placeholder="What did they do that was awesome?" value={modals.newPraise.message || ''} onChange={e => modals.setNewPraise((p: any) => ({ ...p, message: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-pink-500 outline-none text-sm resize-none" />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => modals.setIsPraiseModalOpen(false)} className="flex-1 py-2.5 text-slate-600 dark:text-slate-300 font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors text-sm">Cancel</button>
                                <button type="submit" className="flex-[2] py-2.5 bg-pink-600 text-white font-bold rounded-xl hover:bg-pink-700 transition-colors shadow-lg shadow-pink-900/20 text-sm">Send Praise</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Start Review Cycle Modal ── */}
            {modals.isStartCycleModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Start Review Cycle">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => modals.setIsStartCycleModalOpen(false)} />
                    <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-700 animate-fade-in">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl"><ClipboardList size={18} className="text-indigo-600 dark:text-indigo-400" /></div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Start Review Cycle</h2>
                            </div>
                            <button onClick={() => modals.setIsStartCycleModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"><X size={18} /></button>
                        </div>
                        <form
                            onSubmit={e => {
                                e.preventDefault();
                                data.handleStartReviewCycle(modals.startCycleForm, () => {
                                    modals.setIsStartCycleModalOpen(false);
                                    modals.setStartCycleForm({ period: '', templateId: '' });
                                });
                            }}
                            className="p-6 space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Review Period <span className="text-red-500">*</span></label>
                                <input required type="text" placeholder="e.g. Q4 2024, 2025 Annual" value={modals.startCycleForm.period || ''} onChange={e => modals.setStartCycleForm((p: any) => ({ ...p, period: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Review Template <span className="text-red-500">*</span></label>
                                <select required value={modals.startCycleForm.templateId || ''} onChange={e => modals.setStartCycleForm((p: any) => ({ ...p, templateId: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm">
                                    <option value="" disabled>Select a template</option>
                                    {data.reviewTemplates.map((t: any) => (
                                        <option key={t.id} value={t.id}>{t.name} ({t.role})</option>
                                    ))}
                                </select>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">This will create review records for all eligible employees in your company.</p>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => modals.setIsStartCycleModalOpen(false)} className="flex-1 py-2.5 text-slate-600 dark:text-slate-300 font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors text-sm">Cancel</button>
                                <button type="submit" className="flex-[2] py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-900/20 text-sm">Start Cycle</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Manage Templates Modal ── */}
            {modals.isTemplateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Manage Review Templates">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => modals.setIsTemplateModalOpen(false)} />
                    <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-700 animate-fade-in max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl"><BookTemplate size={18} className="text-indigo-600 dark:text-indigo-400" /></div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Manage Review Templates</h2>
                            </div>
                            <button onClick={() => modals.setIsTemplateModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"><X size={18} /></button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Existing Templates</h3>
                                {data.reviewTemplates.length === 0 ? (
                                    <p className="text-sm text-slate-400 italic">No templates yet. Create one below.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {data.reviewTemplates.map((t: any) => (
                                            <div key={t.id} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 border border-slate-100 dark:border-slate-700">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900 dark:text-white">{t.name}</p>
                                                    <p className="text-xs text-slate-500">{t.role} · {t.questions.length} questions</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Create New Template</h3>
                                <form onSubmit={e => { e.preventDefault(); data.handleSaveTemplate(modals.newTemplate, () => { modals.setNewTemplate({ name: '', role: '', questions: [''] }); }); }} className="space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Template Name <span className="text-red-500">*</span></label>
                                            <input required type="text" placeholder="e.g. Annual Review" value={modals.newTemplate.name || ''} onChange={e => modals.setNewTemplate((p: any) => ({ ...p, name: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Role / Target</label>
                                            <input type="text" placeholder="e.g. Engineer, Sales" value={modals.newTemplate.role || ''} onChange={e => modals.setNewTemplate((p: any) => ({ ...p, role: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Questions <span className="text-red-500">*</span></label>
                                        <div className="space-y-2">
                                            {(modals.newTemplate.questions || ['']).map((q: string, idx: number) => (
                                                <div key={idx} className="flex gap-2">
                                                    <input type="text" required placeholder={`Question ${idx + 1}`} value={q} onChange={e => { const updated = [...(modals.newTemplate.questions || [''])]; updated[idx] = e.target.value; modals.setNewTemplate((p: any) => ({ ...p, questions: updated })); }} className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                                                    {(modals.newTemplate.questions || ['']).length > 1 && (
                                                        <button type="button" onClick={() => modals.setNewTemplate((p: any) => ({ ...p, questions: p.questions.filter((_: any, i: number) => i !== idx) }))} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><X size={14} /></button>
                                                    )}
                                                </div>
                                            ))}
                                            <button type="button" onClick={() => modals.setNewTemplate((p: any) => ({ ...p, questions: [...(p.questions || ['']), ''] }))} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium">+ Add Question</button>
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-1">
                                        <button type="submit" className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-900/20 text-sm">Create Template</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Create Survey Modal ── */}
            {modals.isCreateSurveyModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Create Survey">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => modals.setIsCreateSurveyModalOpen(false)} />
                    <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-700 animate-fade-in max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl"><ClipboardList size={18} className="text-indigo-600 dark:text-indigo-400" /></div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Create Survey</h2>
                            </div>
                            <button onClick={() => modals.setIsCreateSurveyModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"><X size={18} /></button>
                        </div>
                        <form
                            onSubmit={e => {
                                e.preventDefault();
                                data.handleCreateSurvey(modals.newSurvey, () => {
                                    modals.setIsCreateSurveyModalOpen(false);
                                    modals.setNewSurvey({ title: '', description: '', questions: [{ id: crypto.randomUUID(), text: '', type: 'rating' }] });
                                });
                            }}
                            className="p-6 space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Survey Title <span className="text-red-500">*</span></label>
                                <input required type="text" placeholder="e.g. Employee Engagement Survey" value={modals.newSurvey.title || ''} onChange={e => modals.setNewSurvey((p: any) => ({ ...p, title: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
                                <textarea rows={2} placeholder="Briefly describe the purpose of this survey" value={modals.newSurvey.description || ''} onChange={e => modals.setNewSurvey((p: any) => ({ ...p, description: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Questions <span className="text-red-500">*</span></label>
                                <div className="space-y-3">
                                    {(modals.newSurvey.questions || []).map((q: any, idx: number) => (
                                        <div key={q.id || idx} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 border border-slate-100 dark:border-slate-700">
                                            <div className="flex gap-2 mb-2">
                                                <input type="text" required placeholder={`Question ${idx + 1}`} value={q.text} onChange={e => { const updated = [...(modals.newSurvey.questions || [])]; updated[idx] = { ...updated[idx], text: e.target.value }; modals.setNewSurvey((p: any) => ({ ...p, questions: updated })); }} className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                                                {(modals.newSurvey.questions || []).length > 1 && (
                                                    <button type="button" onClick={() => modals.setNewSurvey((p: any) => ({ ...p, questions: p.questions.filter((_: any, i: number) => i !== idx) }))} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><X size={14} /></button>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <button type="button" onClick={() => { const updated = [...(modals.newSurvey.questions || [])]; updated[idx] = { ...updated[idx], type: 'rating' }; modals.setNewSurvey((p: any) => ({ ...p, questions: updated })); }} className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all border ${q.type === 'rating' ? 'bg-indigo-100 border-indigo-200 text-indigo-700 dark:bg-indigo-900/40 dark:border-indigo-800 dark:text-indigo-300' : 'bg-white border-slate-200 text-slate-500 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400'}`}>&#9733; Rating (1–5)</button>
                                                <button type="button" onClick={() => { const updated = [...(modals.newSurvey.questions || [])]; updated[idx] = { ...updated[idx], type: 'text' }; modals.setNewSurvey((p: any) => ({ ...p, questions: updated })); }} className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all border ${q.type === 'text' ? 'bg-indigo-100 border-indigo-200 text-indigo-700 dark:bg-indigo-900/40 dark:border-indigo-800 dark:text-indigo-300' : 'bg-white border-slate-200 text-slate-500 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400'}`}>&#128221; Text Answer</button>
                                            </div>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => modals.setNewSurvey((p: any) => ({ ...p, questions: [...(p.questions || []), { id: crypto.randomUUID(), text: '', type: 'rating' }] }))} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium">+ Add Question</button>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => modals.setIsCreateSurveyModalOpen(false)} className="flex-1 py-2.5 text-slate-600 dark:text-slate-300 font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors text-sm">Cancel</button>
                                <button type="submit" className="flex-[2] py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-900/20 text-sm">Create Survey</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
