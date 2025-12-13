import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  Map as MapIcon, 
  Plus, 
  Search, 
  Bell,
  Settings,
  MoreVertical,
  Calendar,
  DollarSign,
  Plane,
  FileText,
  X,
  Loader2,
  MapPin,
  Briefcase,
  ShieldCheck,
  ShieldAlert,
  Menu,
  Moon,
  Sun,
  Pencil,
  Trash2,
  Download,
  User,
  Mail,
  Phone,
  Shield,
  Lock,
  LogOut,
  Save,
  Check,
  ChevronDown,
  Camera,
  ArrowRight,
  Eye,
  EyeOff,
  ArrowLeft,
  UserCog,
  UserCheck,
  Users,
  Clock,
  CalendarDays,
  Timer,
  CheckCircle2,
  XCircle,
  BriefcaseBusiness,
  Award,
  Heart,
  Star,
  ThumbsUp,
  ClipboardList,
  BarChart2,
  Upload,
  File,
  UserPlus,
  Building2,
  Copy,
  CreditCard,
  ThumbsDown,
  Minus,
  Send,
  UserMinus,
  MessageSquare,
  ArrowUpRight,
  Info,
  AlertTriangle,
  FileStack,
  BookTemplate,
  Target,
  Globe,
  LockKeyhole
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import MarkdownRenderer from './components/MarkdownRenderer';

import { Expense, ExpenseCategory, ViewState, ReceiptAnalysisResult, Trip, UserProfile, Budget, TimeEntry, AbsenceRequest, AbsenceType, Job, JobApplication, Praise, Survey, SurveyResponse, SurveyQuestion, EmployeeDocument, Company, InterviewFeedback, InterviewSentiment, AppNotification, EmployeeReview, ReviewTemplate, Goal } from './types.ts';
import { INITIAL_EXPENSES, MOCK_TRIPS, MOCK_USERS, MOCK_TIME_ENTRIES, MOCK_ABSENCE_REQUESTS, MOCK_JOBS, MOCK_APPLICATIONS, MOCK_PRAISE, MOCK_SURVEYS, MOCK_SURVEY_RESPONSES, MOCK_COMPANY, MOCK_NOTIFICATIONS, MOCK_REVIEWS, MOCK_REVIEW_TEMPLATES, ROLE_BASED_QUESTIONS, MOCK_GOALS } from './constants.ts';
import DashboardStats from './components/DashboardStats.tsx';
import ReceiptUploader from './components/ReceiptUploader.tsx';
import LandingPage from './components/LandingPage.tsx';
import { generateItinerary } from './services/geminiService.ts';
import { generateExpensesPDF, generateItineraryPDF } from './services/pdfService.ts';
import ChatMode from './components/ChatMode';
import LiveMode from './components/LiveMode';
import Assistant from './components/Assistant';

// --- Auth Component ---
interface AuthScreenProps {
  onLogin: (user: UserProfile) => void;
  onBack: () => void;
  availableUsers: UserProfile[];
  company: Company;
  initialIsSignUp?: boolean;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, onBack, availableUsers, company, initialIsSignUp = false }) => {
  const [isSignUp, setIsSignUp] = useState(initialIsSignUp);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'User',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const parts = (isSignUp ? formData.name : 'John Doe').split(' ');
      const initials = parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0][0];

      let assignedCompanyId: string | undefined = undefined;
      
      if (isSignUp) {
         if (inviteCode === company.inviteCode) {
            assignedCompanyId = company.id;
         } else if (inviteCode) {
            alert("Invalid invite code");
            setIsLoading(false);
            return;
         }
      }

      const userProfile: UserProfile = {
        name: isSignUp ? formData.name : 'John Doe',
        email: formData.email,
        role: isSignUp ? formData.role : 'Administrator',
        phone: '',
        avatarInitials: initials.toUpperCase(),
        companyId: isSignUp ? assignedCompanyId : availableUsers.find(u => u.email === formData.email)?.companyId,
        status: 'Active'
      };
      
      onLogin(userProfile);
      setIsLoading(false);
    }, 1500);
  };

  const handleQuickLogin = (email: string) => {
    setIsLoading(true);
    const foundUser = availableUsers.find(u => u.email === email);
    
    setTimeout(() => {
      if (foundUser) {
         onLogin(foundUser);
      } else {
         onLogin(MOCK_USERS[0]);
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-dvh flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-fade-in relative">
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="p-8 pb-0 text-center">
           <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none mb-6">
              <span className="text-white text-3xl font-bold">M</span>
           </div>
           <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
             {isSignUp ? 'Create Account' : 'Welcome Back'}
           </h1>
           <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
             {isSignUp ? 'Join MigoPortal for smart expense management' : 'Sign in to manage your LLC travel & expenses'}
           </p>
        </div>

        <div className="px-8 mt-6">
           <p className="text-xs font-semibold text-slate-400 text-center mb-3 uppercase tracking-wider">Quick Demo Login</p>
           <div className="grid grid-cols-2 gap-3">
             <button onClick={() => handleQuickLogin('admin@migoportal.com')} className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900 rounded-xl text-xs font-bold hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors flex flex-col items-center">
               <UserCog size={20} className="mb-1" />
               Login as Admin
             </button>
             <button onClick={() => handleQuickLogin('bob@migoportal.com')} className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900 rounded-xl text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors flex flex-col items-center">
               <UserCheck size={20} className="mb-1" />
               Login as User
             </button>
           </div>
           <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-slate-900 px-2 text-slate-400">Or continue with email</span></div>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
          {isSignUp && (
             <div className="space-y-2 animate-fade-in">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Company Invite Code (Optional)</label>
              <div className="relative">
                <Building2 size={18} className="absolute left-3 top-3 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Enter code (e.g. TECH-2024)"
                  className="w-full pl-10 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                  value={inviteCode}
                  onChange={e => setInviteCode(e.target.value)}
                />
              </div>
              <p className="text-xs text-slate-400">Use code <b>{company.inviteCode}</b> to join {company.name}</p>
            </div>
          )}

          {isSignUp && (
            <div className="space-y-2 animate-fade-in">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-3 text-slate-400" />
                <input 
                  type="text" 
                  required
                  placeholder="John Doe"
                  className="w-full pl-10 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-3 text-slate-400" />
              <input 
                type="email" 
                required
                placeholder="you@company.com"
                className="w-full pl-10 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-3 text-slate-400" />
              <input 
                type={showPassword ? "text" : "password"} 
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-10 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {isSignUp && (
            <div className="space-y-2 animate-fade-in">
               <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Account Type</label>
               <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, role: 'User'})}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all
                      ${formData.role === 'User' 
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/20 dark:border-indigo-400 dark:text-indigo-300' 
                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'}
                    `}
                  >
                     <User size={24} />
                     <span className="text-xs font-semibold">Normal User</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, role: 'Administrator'})}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all
                      ${formData.role === 'Administrator' 
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/20 dark:border-indigo-400 dark:text-indigo-300' 
                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'}
                    `}
                  >
                     <ShieldCheck size={24} />
                     <span className="text-xs font-semibold">Administrator</span>
                  </button>
               </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 transition-all flex justify-center items-center"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            {isSignUp ? 'Already have an account?' : 'Don\'t have an account?'}
            <button 
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="ml-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              {isSignUp ? 'Log in' : 'Sign up'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

// --- Confirmation Modal Component ---
interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
  isOpen, title, message, confirmText = "Confirm", cancelText = "Cancel", isDestructive = false, onConfirm, onCancel 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
       <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200 dark:border-slate-800 scale-100 transition-all">
          <div className="p-6 text-center">
             <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isDestructive ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'}`}>
                {isDestructive ? <ShieldAlert size={24} /> : <ShieldCheck size={24} />}
             </div>
             <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
             <p className="text-slate-500 dark:text-slate-400 text-sm">{message}</p>
          </div>
          <div className="flex border-t border-slate-100 dark:border-slate-800">
             <button onClick={onCancel} className="flex-1 py-3 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                {cancelText}
             </button>
             <div className="w-[1px] bg-slate-100 dark:bg-slate-800"></div>
             <button onClick={onConfirm} className={`flex-1 py-3 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${isDestructive ? 'text-red-600 dark:text-red-400' : 'text-indigo-600 dark:text-indigo-400'}`}>
                {confirmText}
             </button>
          </div>
       </div>
    </div>
  );
};


// --- Main App Component ---
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [view, setView] = useState<ViewState>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Data State
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [trips, setTrips] = useState<Trip[]>(MOCK_TRIPS);
  const [allUsers, setAllUsers] = useState<UserProfile[]>(MOCK_USERS);
  const [user, setUser] = useState<UserProfile>(MOCK_USERS[1]); // Default to Bob
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(MOCK_TIME_ENTRIES);
  const [absenceRequests, setAbsenceRequests] = useState<AbsenceRequest[]>(MOCK_ABSENCE_REQUESTS);
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [applications, setApplications] = useState<JobApplication[]>(MOCK_APPLICATIONS);
  const [praiseList, setPraiseList] = useState<Praise[]>(MOCK_PRAISE);
  const [surveys, setSurveys] = useState<Survey[]>(MOCK_SURVEYS);
  const [surveyResponses, setSurveyResponses] = useState<SurveyResponse[]>(MOCK_SURVEY_RESPONSES);
  const [reviews, setReviews] = useState<EmployeeReview[]>(MOCK_REVIEWS);
  const [reviewTemplates, setReviewTemplates] = useState<ReviewTemplate[]>(MOCK_REVIEW_TEMPLATES);
  const [goals, setGoals] = useState<Goal[]>(MOCK_GOALS);
  
  // Notification State
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);
  const [visibleNotificationsCount, setVisibleNotificationsCount] = useState(10);
  
  // Company Data State
  const [currentCompany, setCurrentCompany] = useState<Company>(MOCK_COMPANY);
  const [seatCount, setSeatCount] = useState(2); // Subscription seat count

  // Pagination State
  const [visibleExpensesCount, setVisibleExpensesCount] = useState(10);
  const [visibleTripsCount, setVisibleTripsCount] = useState(10);

  // Modal States
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseEntryMode, setExpenseEntryMode] = useState<'scan' | 'manual'>('scan');
  const [newManualExpense, setNewManualExpense] = useState<Partial<Expense>>({
    date: new Date().toISOString().split('T')[0],
    currency: 'USD',
    category: ExpenseCategory.OTHER,
    merchant: '',
    amount: 0,
    description: ''
  });

  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  const [isItineraryModalOpen, setIsItineraryModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  // Time & Absence States
  const [activeTimeAbsenceTab, setActiveTimeAbsenceTab] = useState<'time' | 'absence'>('time');
  const [timeAbsenceViewMode, setTimeAbsenceViewMode] = useState<'personal' | 'team'>('personal');
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [isAbsenceModalOpen, setIsAbsenceModalOpen] = useState(false);
  const [newTimeEntry, setNewTimeEntry] = useState<Partial<TimeEntry>>({ date: new Date().toISOString().split('T')[0], startTime: '09:00', endTime: '17:00', description: '', breakMinutes: 0 });
  const [newAbsence, setNewAbsence] = useState<Partial<AbsenceRequest>>({ startDate: new Date().toISOString().split('T')[0], endDate: new Date().toISOString().split('T')[0], type: AbsenceType.VACATION, reason: '' });

  // Job Portal States
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [selectedJobForApplication, setSelectedJobForApplication] = useState<Job | null>(null);
  const [newJob, setNewJob] = useState<Partial<Job>>({ title: '', department: '', location: '', type: 'Full-time', salaryRange: '', description: '', status: 'Open' });
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedJobToApply, setSelectedJobToApply] = useState<Job | null>(null);
  const [applicationNote, setApplicationNote] = useState('');
  const [applicationCv, setApplicationCv] = useState<{name: string, data: string} | null>(null);

  // Recruitment States (Interview & Decisions)
  const [activeRecruitmentTab, setActiveRecruitmentTab] = useState<'candidates' | 'interviews'>('candidates');
  const [isAssignInterviewerModalOpen, setIsAssignInterviewerModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [feedbackForm, setFeedbackForm] = useState<{ notes: string; sentiment: InterviewSentiment }>({ notes: '', sentiment: 'Neutral' });
  const [decisionForm, setDecisionForm] = useState<{ status: 'Hired' | 'Rejected', feedback: string }>({ status: 'Hired', feedback: '' });
  const [newInterview, setNewInterview] = useState<{
    date: string;
    time: string;
    interviewerEmail: string;
  }>({ date: '', time: '', interviewerEmail: '' });

  // Praise States
  const [isPraiseModalOpen, setIsPraiseModalOpen] = useState(false);
  const [newPraise, setNewPraise] = useState<{
    toUserEmail: string;
    message: string;
    category: Praise['category'];
  }>({ toUserEmail: '', message: '', category: 'Teamwork' });

  // Survey States
  const [isCreateSurveyModalOpen, setIsCreateSurveyModalOpen] = useState(false);
  const [isTakeSurveyModalOpen, setIsTakeSurveyModalOpen] = useState(false);
  const [isSurveyResultsModalOpen, setIsSurveyResultsModalOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [newSurvey, setNewSurvey] = useState<{
    title: string;
    description: string;
    questions: { id: string; text: string; type: 'rating' | 'text' }[];
  }>({ title: '', description: '', questions: [{ id: uuidv4(), text: '', type: 'rating' }] });
  const [surveyAnswers, setSurveyAnswers] = useState<Record<string, string | number>>({});

  // Employee Review State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<EmployeeReview | null>(null);
  const [activeReviewTab, setActiveReviewTab] = useState<'my-reviews' | 'team-reviews'>('my-reviews');
  const [reviewForm, setReviewForm] = useState<{ text: string; rating: number }>({ text: '', rating: 0 });
  const [reviewResponses, setReviewResponses] = useState<Record<string, string>>({}); // Keyed by question text for simplicity
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isStartCycleModalOpen, setIsStartCycleModalOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState<{ name: string; role: string; questions: string[] }>({ name: '', role: 'Software Engineer', questions: [] });
  const [startCycleForm, setStartCycleForm] = useState({ period: '', templateId: '' });

  // Goal State
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({ title: '', description: '', type: 'Business', visibility: 'Manager', status: 'Not Started', dueDate: '' });

  // Password Reset State
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [resetPasswordForm, setResetPasswordForm] = useState({ current: '', new: '', confirm: '' });

  // Team Management State
  const [isManageTeamModalOpen, setIsManageTeamModalOpen] = useState(false);
  const [manageTeamMode, setManageTeamMode] = useState<'assign_manager' | 'add_member'>('assign_manager');
  const [selectedTeamMember, setSelectedTeamMember] = useState<UserProfile | null>(null);
  const [newManagerEmail, setNewManagerEmail] = useState('');
  const [newTeamMemberEmail, setNewTeamMemberEmail] = useState('');
  const [isInviteUserModalOpen, setIsInviteUserModalOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: 'User', department: '', jobTitle: '' });
  
  // Team Member Profile Modal
  const [isTeamMemberProfileModalOpen, setIsTeamMemberProfileModalOpen] = useState(false);
  const [selectedTeamMemberProfile, setSelectedTeamMemberProfile] = useState<UserProfile | null>(null);


  // Documents Upload State
  const [isDocumentUploadModalOpen, setIsDocumentUploadModalOpen] = useState(false);
  const [newDocumentForm, setNewDocumentForm] = useState<{ name: string; category: EmployeeDocument['category'] }>({ name: '', category: 'Other' });
  const [newDocumentFile, setNewDocumentFile] = useState<{name: string, type: string, data: string} | null>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  // Selection States
  const [selectedTripForItinerary, setSelectedTripForItinerary] = useState<Trip | null>(null);
  const [generatedItinerary, setGeneratedItinerary] = useState<string>('');
  const [isGeneratingItinerary, setIsGeneratingItinerary] = useState(false);
  const [editingTripId, setEditingTripId] = useState<string | null>(null);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  // Budget Management State
  const [selectedUserForBudget, setSelectedUserForBudget] = useState<UserProfile | null>(null);
  const [newBudget, setNewBudget] = useState<Partial<Budget>>({ amount: 0, period: 'Monthly' });

  // Settings / Profile State
  const [activeSettingsTab, setActiveSettingsTab] = useState<'personal' | 'employment' | 'compensation' | 'documents' | 'security'>('personal');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedUser, setEditedUser] = useState<UserProfile>(user);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);
  const [showSalary, setShowSalary] = useState(false);

  // Confirmation Modal State
  const [confirmationModal, setConfirmationModal] = useState<{
     isOpen: boolean;
     title: string;
     message: string;
     action: 'approve' | 'reject' | 'approve-absence' | 'reject-absence' | 'delete-job' | 'delete-survey' | 'remove-team-member' | 'hire-candidate' | 'reject-candidate' | 'logout' | 'approve-time' | 'reject-time' | 'delete-time-entry' | 'delete-absence-request' | 'delete-goal';
     itemId: string | null;
     isDestructive?: boolean;
  }>({ isOpen: false, title: '', message: '', action: 'approve', itemId: null });

  // New Trip Form State
  const [newTrip, setNewTrip] = useState<Partial<Trip>>({
    destination: '',
    startDate: '',
    endDate: '',
    purpose: '',
    budget: 0
  });

  // Dark Mode Init
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Update user state when auth changes
  useEffect(() => {
     if (isAuthenticated) {
        setEditedUser(user);
        // Default to interviews tab for non-admins when entering recruitment
        if (user.role !== 'Administrator') {
            setActiveRecruitmentTab('interviews');
        }
     }
  }, [isAuthenticated, user]);
  
  // Reset expense modal mode when closed
  useEffect(() => {
    if (!isExpenseModalOpen) {
        setExpenseEntryMode('scan');
    }
  }, [isExpenseModalOpen]);

  // Scroll Lock for Modals
  useEffect(() => {
    const isAnyModalOpen = isExpenseModalOpen || isTripModalOpen || isItineraryModalOpen || isMobileMenuOpen || isBudgetModalOpen || isLogoutModalOpen || isDetailModalOpen || confirmationModal.isOpen || isTimeModalOpen || isAbsenceModalOpen || isJobModalOpen || isApplicationModalOpen || isPraiseModalOpen || isCreateSurveyModalOpen || isTakeSurveyModalOpen || isSurveyResultsModalOpen || isAssignInterviewerModalOpen || isFeedbackModalOpen || isDecisionModalOpen || isResetPasswordModalOpen || isApplyModalOpen || isManageTeamModalOpen || isInviteUserModalOpen || isDocumentUploadModalOpen || isTeamMemberProfileModalOpen || isReviewModalOpen || isTemplateModalOpen || isStartCycleModalOpen || isGoalModalOpen;
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isExpenseModalOpen, isTripModalOpen, isItineraryModalOpen, isMobileMenuOpen, isBudgetModalOpen, isLogoutModalOpen, isDetailModalOpen, confirmationModal.isOpen, isTimeModalOpen, isAbsenceModalOpen, isJobModalOpen, isApplicationModalOpen, isPraiseModalOpen, isCreateSurveyModalOpen, isTakeSurveyModalOpen, isSurveyResultsModalOpen, isAssignInterviewerModalOpen, isFeedbackModalOpen, isDecisionModalOpen, isResetPasswordModalOpen, isApplyModalOpen, isManageTeamModalOpen, isInviteUserModalOpen, isDocumentUploadModalOpen, isTeamMemberProfileModalOpen, isReviewModalOpen, isTemplateModalOpen, isStartCycleModalOpen, isGoalModalOpen]);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const calculateLeaveBalance = (type: AbsenceType) => {
      const approvedRequests = absenceRequests.filter(req => req.userId === user.email && req.status === 'Approved' && req.type === type);
      let daysUsed = 0;
      approvedRequests.forEach(req => {
          const start = new Date(req.startDate);
          const end = new Date(req.endDate);
          const diffTime = Math.abs(end.getTime() - start.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
          daysUsed += diffDays;
      });
      return daysUsed;
  };

  const handleReceiptAnalysis = (data: ReceiptAnalysisResult, imageUrl: string) => {
    const newExpense: Expense = {
      id: uuidv4(),
      merchant: data.merchant,
      amount: data.amount,
      currency: data.currency,
      date: data.date,
      category: data.category || ExpenseCategory.OTHER,
      description: data.description || 'Receipt Scan',
      receiptUrl: imageUrl,
      status: 'Pending',
      taxDeductibility: data.taxDeductibility,
      taxReasoning: data.taxReasoning,
      submittedBy: user.name,
      companyId: user.companyId || ''
    };
    setExpenses(prev => [newExpense, ...prev]);
  };
  
  const handleSaveManualExpense = () => {
    if (!newManualExpense.merchant || !newManualExpense.amount) return;
    
    const expense: Expense = {
        id: uuidv4(),
        merchant: newManualExpense.merchant,
        amount: Number(newManualExpense.amount),
        currency: newManualExpense.currency || 'USD',
        date: newManualExpense.date || new Date().toISOString().split('T')[0],
        category: newManualExpense.category || ExpenseCategory.OTHER,
        description: newManualExpense.description || 'Manual Entry',
        status: 'Pending',
        taxDeductibility: 'Partial',
        submittedBy: user.name,
        companyId: user.companyId || ''
    };
    
    setExpenses(prev => [expense, ...prev]);
    setIsExpenseModalOpen(false);
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setApplicationCv({
                name: file.name,
                data: reader.result as string
            });
        };
        reader.readAsDataURL(file);
      }
  };

  const handleInitiateApply = (job: Job) => {
      setSelectedJobToApply(job);
      setApplicationNote('');
      setApplicationCv(null);
      setIsApplyModalOpen(true);
  };

  const handleConfirmApply = () => {
      if (!selectedJobToApply) return;
      const newApp: JobApplication = {
          id: uuidv4(),
          jobId: selectedJobToApply.id,
          applicantName: user.name,
          applicantEmail: user.email,
          appliedDate: new Date().toISOString().split('T')[0],
          status: 'Pending',
          companyId: user.companyId || '',
          reviews: [],
          coverNote: applicationNote,
          cvUrl: applicationCv?.data,
          cvName: applicationCv?.name
      };
      setApplications(prev => [...prev, newApp]);
      setIsApplyModalOpen(false);
      alert("Application submitted successfully!");
  };

  const handleSaveTimeEntry = () => {
      if (!newTimeEntry.startTime || !newTimeEntry.endTime) return;
      
      const start = new Date(`2000-01-01T${newTimeEntry.startTime}`);
      const end = new Date(`2000-01-01T${newTimeEntry.endTime}`);
      let diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      
      if (newTimeEntry.breakMinutes) {
          diff -= (newTimeEntry.breakMinutes / 60);
      }

      if (diff < 0) diff += 24;

      const entry: TimeEntry = {
          id: uuidv4(),
          date: newTimeEntry.date!,
          startTime: newTimeEntry.startTime,
          endTime: newTimeEntry.endTime,
          description: newTimeEntry.description || '',
          totalHours: Number(diff.toFixed(2)),
          breakMinutes: newTimeEntry.breakMinutes || 0,
          userId: user.email,
          userName: user.name,
          companyId: user.companyId || '',
          status: 'Pending'
      };
      
      setTimeEntries(prev => [entry, ...prev]);
      setIsTimeModalOpen(false);
  };
  
  const handleSaveAbsence = () => {
      if (!newAbsence.startDate || !newAbsence.endDate) return;
      
      const request: AbsenceRequest = {
          id: uuidv4(),
          startDate: newAbsence.startDate,
          endDate: newAbsence.endDate,
          type: newAbsence.type!,
          reason: newAbsence.reason || '',
          status: 'Pending',
          userId: user.email,
          userName: user.name,
          companyId: user.companyId || ''
      };
      
      setAbsenceRequests(prev => [request, ...prev]);
      setIsAbsenceModalOpen(false);
  };

  const handleSaveTeamAssignment = (employeeEmail: string, managerEmail: string) => {
      setAllUsers(prev => prev.map(u => {
          if (u.email === employeeEmail) {
              const manager = prev.find(m => m.email === managerEmail);
              return {
                  ...u,
                  employment: {
                      ...(u.employment!),
                      managerName: manager?.name,
                      managerEmail: manager?.email
                  }
              };
          }
          return u;
      }));
      if (user.email === employeeEmail) {
          const manager = allUsers.find(m => m.email === managerEmail);
          setUser(prev => ({
              ...prev,
               employment: {
                  ...(prev.employment!),
                  managerName: manager?.name,
                  managerEmail: manager?.email
              }
          }));
      }
      setIsManageTeamModalOpen(false);
  };

  const handleRemoveTeamMember = () => {
      if (!confirmationModal.itemId) return;
      
      setAllUsers(prev => prev.map(u => {
          if (u.email === confirmationModal.itemId) {
              return {
                  ...u,
                  employment: {
                      ...(u.employment!),
                      managerName: undefined,
                      managerEmail: undefined
                  }
              };
          }
          return u;
      }));
      setConfirmationModal({ ...confirmationModal, isOpen: false });
  };
  
  const handleOpenAssignManager = (targetUser: UserProfile) => {
      setSelectedTeamMember(targetUser);
      setNewManagerEmail(targetUser.employment?.managerEmail || '');
      setManageTeamMode('assign_manager');
      setIsManageTeamModalOpen(true);
  };

  const handleOpenAddTeamMember = () => {
      setManageTeamMode('add_member');
      setNewTeamMemberEmail('');
      setIsManageTeamModalOpen(true);
  };
  
  const handleSendInvite = () => {
    if (!inviteForm.email || !inviteForm.name) return;

    const initials = inviteForm.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    const newUser: UserProfile = {
        name: inviteForm.name,
        email: inviteForm.email,
        role: inviteForm.role,
        phone: '',
        avatarInitials: initials,
        companyId: user.companyId,
        status: 'Pending',
        employment: {
            jobTitle: inviteForm.jobTitle,
            department: inviteForm.department,
            startDate: new Date().toISOString().split('T')[0],
            employmentType: 'Full-time',
            location: 'Remote' // Default
        }
    };

    setAllUsers(prev => [...prev, newUser]);
    setIsInviteUserModalOpen(false);
    setInviteForm({ name: '', email: '', role: 'User', department: '', jobTitle: '' });
    alert(`Invitation sent to ${inviteForm.email}`);
  };

  const handleResetPassword = () => {
      if (resetPasswordForm.new !== resetPasswordForm.confirm) {
          alert("Passwords do not match");
          return;
      }
      setTimeout(() => {
          alert("Password updated successfully");
          setIsResetPasswordModalOpen(false);
          setResetPasswordForm({ current: '', new: '', confirm: '' });
      }, 1000);
  };

  const handleSaveProfile = () => {
    setUser(editedUser);
    setAllUsers(prev => prev.map(u => u.email === user.email ? editedUser : u));
    setIsEditingProfile(false);
  };
  
  const handleSaveJob = () => {
     if (editingJobId) {
         setJobs(prev => prev.map(j => j.id === editingJobId ? { ...j, ...newJob } as Job : j));
     } else {
         const job: Job = {
             id: uuidv4(),
             ...newJob as Job,
             postedDate: new Date().toISOString().split('T')[0],
             companyId: user.companyId || ''
         };
         setJobs(prev => [job, ...prev]);
     }
     setIsJobModalOpen(false);
     setEditingJobId(null);
  };

  const handleSaveTrip = () => {
    if (!newTrip.destination || !newTrip.startDate || !newTrip.endDate) return;

    if (editingTripId) {
      setTrips(prev => prev.map(t => t.id === editingTripId ? { ...t, ...newTrip } as Trip : t));
    } else {
      const trip: Trip = {
        id: uuidv4(),
        ...newTrip as Trip,
        spent: 0,
        status: 'Planned',
        companyId: user.companyId || ''
      };
      setTrips(prev => [trip, ...prev]);
    }
    setIsTripModalOpen(false);
    setEditingTripId(null);
  };

  const handleGenerateItinerary = async (trip: Trip) => {
    setIsGeneratingItinerary(true);
    setSelectedTripForItinerary(trip);
    try {
      const result = await generateItinerary(trip.destination, trip.startDate, trip.endDate, trip.purpose);
      if (result) {
        setGeneratedItinerary(result);
        setIsItineraryModalOpen(true);
        // Save to trip
        setTrips(prev => prev.map(t => t.id === trip.id ? { ...t, itinerary: result } : t));
      }
    } catch (error) {
      alert("Failed to generate itinerary. Please try again.");
    } finally {
      setIsGeneratingItinerary(false);
    }
  };

  const handleSendPraise = () => {
      if (!newPraise.toUserEmail || !newPraise.message) return;
      
      const toUser = allUsers.find(u => u.email === newPraise.toUserEmail);
      if (!toUser) return;

      const praise: Praise = {
          id: uuidv4(),
          fromUserName: user.name,
          fromUserEmail: user.email,
          fromUserInitials: user.avatarInitials,
          toUserName: toUser.name,
          toUserEmail: toUser.email,
          toUserInitials: toUser.avatarInitials,
          message: newPraise.message,
          category: newPraise.category,
          date: new Date().toISOString().split('T')[0],
          companyId: user.companyId || ''
      };
      
      setPraiseList(prev => [praise, ...prev]);
      setIsPraiseModalOpen(false);
      setNewPraise({ toUserEmail: '', message: '', category: 'Teamwork' });
  };
  
  const handleScheduleInterview = () => {
      if (!selectedApplication || !newInterview.interviewerEmail || !newInterview.date || !newInterview.time) return;

      const interviewer = allUsers.find(u => u.email === newInterview.interviewerEmail);
      if (!interviewer) return;

      const newReview: InterviewFeedback = {
          id: uuidv4(),
          interviewerEmail: interviewer.email,
          interviewerName: interviewer.name,
          assignedDate: `${newInterview.date} ${newInterview.time}`,
          status: 'Pending'
      };

      setApplications(prev => prev.map(app => {
          if (app.id === selectedApplication.id) {
              return {
                  ...app,
                  status: 'Interview',
                  reviews: [...app.reviews, newReview]
              };
          }
          return app;
      }));
      
      setIsAssignInterviewerModalOpen(false);
      setNewInterview({ date: '', time: '', interviewerEmail: '' });
      alert(`Interview scheduled with ${interviewer.name}`);
  };

  const handleSubmitFeedback = () => {
      if (!selectedApplication || !selectedReviewId) return;

      setApplications(prev => prev.map(app => {
          if (app.id === selectedApplication.id) {
              return {
                  ...app,
                  reviews: app.reviews.map(rev => {
                      if (rev.id === selectedReviewId) {
                          return {
                              ...rev,
                              status: 'Completed',
                              notes: feedbackForm.notes,
                              sentiment: feedbackForm.sentiment,
                              completedDate: new Date().toISOString().split('T')[0]
                          };
                      }
                      return rev;
                  })
              };
          }
          return app;
      }));

      setIsFeedbackModalOpen(false);
      setFeedbackForm({ notes: '', sentiment: 'Neutral' });
      setSelectedReviewId(null);
      alert("Feedback submitted successfully");
  };

  const handleUpdateStatus = (appId: string, status: 'Hired' | 'Rejected') => {
      setApplications(prev => prev.map(app => 
          app.id === appId ? { ...app, status: status } : app
      ));
      alert(`Candidate marked as ${status}`);
  };

  const handleOpenReviewModal = (review: EmployeeReview) => {
    setSelectedReview(review);
    
    // Check if structured or unstructured
    if (review.templateId && review.responses) {
        // Load existing answers into state
        const responsesMap: Record<string, string> = {};
        review.responses.forEach(r => {
            if (review.status === 'Pending Self' && r.selfAnswer) responsesMap[r.question] = r.selfAnswer;
            else if (review.status === 'Pending Manager' && r.managerAnswer) responsesMap[r.question] = r.managerAnswer;
        });
        setReviewResponses(responsesMap);
    }

    // Pre-populate ratings/text if legacy
    const isManager = review.managerEmail === user.email;
    if (isManager) {
        setReviewForm({ text: review.managerReview || '', rating: review.managerRating || 0 });
    } else {
        setReviewForm({ text: review.selfReview || '', rating: review.selfRating || 0 });
    }
    
    setIsReviewModalOpen(true);
  };

  const handleSaveReview = () => {
    if (!selectedReview) return;

    const isManager = selectedReview.managerEmail === user.email;
    
    setReviews(prev => prev.map(r => {
        if (r.id === selectedReview.id) {
            
            // Handle Structured Responses Update
            let updatedResponses = r.responses;
            if (r.templateId && r.responses) {
                updatedResponses = r.responses.map(resp => {
                    const answer = reviewResponses[resp.question];
                    if (answer) {
                       if (isManager) return { ...resp, managerAnswer: answer };
                       else return { ...resp, selfAnswer: answer };
                    }
                    return resp;
                });
            }

            if (isManager) {
                return {
                    ...r,
                    managerReview: reviewForm.text,
                    managerRating: reviewForm.rating,
                    completedAt: new Date().toISOString().split('T')[0],
                    status: 'Completed',
                    responses: updatedResponses
                };
            } else {
                return {
                    ...r,
                    selfReview: reviewForm.text,
                    selfRating: reviewForm.rating,
                    submittedAt: new Date().toISOString().split('T')[0],
                    status: 'Pending Manager',
                    responses: updatedResponses
                };
            }
        }
        return r;
    }));
    
    setIsReviewModalOpen(false);
    setSelectedReview(null);
    setReviewForm({ text: '', rating: 0 });
    setReviewResponses({});
  };

  // Review Template Logic
  const handleLoadExampleQuestions = (role: string) => {
      const examples = ROLE_BASED_QUESTIONS[role] || [];
      setNewTemplate(prev => ({ ...prev, questions: [...prev.questions, ...examples] }));
  };

  const handleSaveTemplate = () => {
      if (!newTemplate.name || newTemplate.questions.length === 0) return;
      const template: ReviewTemplate = {
          id: uuidv4(),
          name: newTemplate.name,
          role: newTemplate.role,
          questions: newTemplate.questions,
          companyId: user.companyId || ''
      };
      setReviewTemplates(prev => [...prev, template]);
      setIsTemplateModalOpen(false);
      setNewTemplate({ name: '', role: 'Software Engineer', questions: [] });
  };

  const handleStartReviewCycle = () => {
      if (!startCycleForm.period || !startCycleForm.templateId) return;
      
      const template = reviewTemplates.find(t => t.id === startCycleForm.templateId);
      if (!template) return;

      // For demo, we assign to all non-admin users. In real app, filter by role.
      const eligibleUsers = allUsers.filter(u => u.role !== 'Administrator');
      
      const newReviews: EmployeeReview[] = eligibleUsers.map(emp => {
          const manager = allUsers.find(u => u.email === emp.employment?.managerEmail) || allUsers.find(u => u.role === 'Administrator')!; // Fallback to admin if no manager
          
          return {
              id: uuidv4(),
              period: startCycleForm.period,
              employeeName: emp.name,
              employeeEmail: emp.email,
              managerName: manager.name,
              managerEmail: manager.email,
              status: 'Pending Self',
              companyId: user.companyId || '',
              templateId: template.id,
              responses: template.questions.map(q => ({ question: q }))
          };
      });

      setReviews(prev => [...prev, ...newReviews]);
      setIsStartCycleModalOpen(false);
      setStartCycleForm({ period: '', templateId: '' });
      alert(`Review cycle started! Assigned ${newReviews.length} reviews.`);
  };

  // Goal Management Handlers
  const handleSaveGoal = () => {
      if (!newGoal.title || !newGoal.dueDate) return;
      
      const goal: Goal = {
          id: uuidv4(),
          title: newGoal.title,
          description: newGoal.description || '',
          type: newGoal.type || 'Business',
          visibility: newGoal.visibility || 'Manager',
          status: 'Not Started',
          dueDate: newGoal.dueDate,
          userId: user.email,
          userName: user.name,
          companyId: user.companyId || ''
      };
      
      setGoals(prev => [goal, ...prev]);
      setIsGoalModalOpen(false);
      setNewGoal({ title: '', description: '', type: 'Business', visibility: 'Manager', status: 'Not Started', dueDate: '' });
  };

  const handleUpdateGoalStatus = (goalId: string, status: Goal['status']) => {
      setGoals(prev => prev.map(g => g.id === goalId ? { ...g, status } : g));
  };
  
  // Document Upload Handlers
  const handleDocumentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setNewDocumentFile({
                  name: file.name,
                  type: file.type,
                  data: reader.result as string
              });
              // Auto-populate name if empty
              if (!newDocumentForm.name) {
                  setNewDocumentForm(prev => ({ ...prev, name: file.name.split('.')[0] }));
              }
          };
          reader.readAsDataURL(file);
      }
  };

  const handleSaveDocument = () => {
      if (!newDocumentFile || !newDocumentForm.name) return;

      let docType: EmployeeDocument['type'] = 'Doc';
      if (newDocumentFile.type.includes('pdf')) docType = 'PDF';
      else if (newDocumentFile.type.includes('image')) docType = 'Image';

      const newDoc: EmployeeDocument = {
          id: uuidv4(),
          name: newDocumentForm.name,
          category: newDocumentForm.category,
          type: docType,
          uploadDate: new Date().toISOString().split('T')[0],
          url: newDocumentFile.data
      };

      setUser(prev => ({
          ...prev,
          documents: [...(prev.documents || []), newDoc]
      }));

      setIsDocumentUploadModalOpen(false);
      setNewDocumentFile(null);
      setNewDocumentForm({ name: '', category: 'Other' });
  };

  // Helpers for Survey Creation
  const handleAddQuestion = () => {
      setNewSurvey({
          ...newSurvey,
          questions: [...newSurvey.questions, { id: uuidv4(), text: '', type: 'rating' }]
      });
  };

  const handleUpdateQuestion = (id: string, field: 'text' | 'type', value: string) => {
      setNewSurvey({
          ...newSurvey,
          questions: newSurvey.questions.map(q => q.id === id ? { ...q, [field]: value } : q)
      });
  };

  const handleRemoveQuestion = (id: string) => {
      setNewSurvey({
          ...newSurvey,
          questions: newSurvey.questions.filter(q => q.id !== id)
      });
  };

  const handleSaveSurvey = () => {
      if (!newSurvey.title || newSurvey.questions.some(q => !q.text)) {
          alert("Please fill in the survey title and all questions.");
          return;
      }
      
      const survey: Survey = {
          id: uuidv4(),
          title: newSurvey.title,
          description: newSurvey.description,
          questions: newSurvey.questions as SurveyQuestion[],
          isActive: true,
          createdAt: new Date().toISOString().split('T')[0],
          createdBy: user.name,
          companyId: user.companyId || ''
      };
      
      setSurveys(prev => [survey, ...prev]);
      setIsCreateSurveyModalOpen(false);
      setNewSurvey({ title: '', description: '', questions: [{ id: uuidv4(), text: '', type: 'rating' }] });
  };

  const handleConfirmationAction = () => {
      const { action, itemId } = confirmationModal;
      
      if (action === 'logout') {
          setIsAuthenticated(false);
          setShowLandingPage(true);
          setView('dashboard');
      } else if (action === 'approve' && itemId) {
          setExpenses(prev => prev.map(e => e.id === itemId ? { ...e, status: 'Approved' } : e));
      } else if (action === 'reject' && itemId) {
          setExpenses(prev => prev.map(e => e.id === itemId ? { ...e, status: 'Rejected' } : e));
      } else if (action === 'approve-absence' && itemId) {
          setAbsenceRequests(prev => prev.map(a => a.id === itemId ? { ...a, status: 'Approved' } : a));
      } else if (action === 'reject-absence' && itemId) {
          setAbsenceRequests(prev => prev.map(a => a.id === itemId ? { ...a, status: 'Rejected' } : a));
      } else if (action === 'approve-time' && itemId) {
          setTimeEntries(prev => prev.map(t => t.id === itemId ? { ...t, status: 'Approved' } : t));
      } else if (action === 'reject-time' && itemId) {
          setTimeEntries(prev => prev.map(t => t.id === itemId ? { ...t, status: 'Rejected' } : t));
      } else if (action === 'delete-job' && itemId) {
          setJobs(prev => prev.filter(j => j.id !== itemId));
      } else if (action === 'delete-survey' && itemId) {
          setSurveys(prev => prev.filter(s => s.id !== itemId));
      } else if (action === 'remove-team-member' && itemId) {
          handleRemoveTeamMember();
      } else if (action === 'hire-candidate' && itemId) {
          handleUpdateStatus(itemId, 'Hired');
      } else if (action === 'reject-candidate' && itemId) {
          handleUpdateStatus(itemId, 'Rejected');
      } else if (action === 'delete-time-entry' && itemId) {
          setTimeEntries(prev => prev.filter(t => t.id !== itemId));
      } else if (action === 'delete-absence-request' && itemId) {
          setAbsenceRequests(prev => prev.filter(a => a.id !== itemId));
      } else if (action === 'delete-goal' && itemId) {
          setGoals(prev => prev.filter(g => g.id !== itemId));
      }
      
      setConfirmationModal({ ...confirmationModal, isOpen: false, itemId: null });
  };

  // Render Section Helpers
  const renderSidebar = () => (
    <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static`}>
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
                <button onClick={() => { setView('time-absence'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'time-absence' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                    <Clock size={20} />
                    <span className="font-medium">Time & Absence</span>
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

  if (!showLandingPage && !isAuthenticated) {
     return <AuthScreen onLogin={(u) => { setIsAuthenticated(true); setUser(u); }} onBack={() => setShowLandingPage(true)} availableUsers={MOCK_USERS} company={currentCompany} initialIsSignUp={authMode === 'signup'} />;
  }

  if (showLandingPage) {
     return <LandingPage onNavigateToAuth={(mode) => { setAuthMode(mode || 'login'); setShowLandingPage(false); }} />;
  }

  const myTeam = allUsers.filter(u => u.employment?.managerEmail === user.email);
  const isManager = myTeam.length > 0 || user.role === 'Administrator';

  // Filter Absence/Time Requests for Managers/Admins
  const teamAbsenceRequests = user.role === 'Administrator' 
      ? absenceRequests 
      : absenceRequests.filter(req => myTeam.some(member => member.email === req.userId));

  const teamTimeEntries = user.role === 'Administrator'
      ? timeEntries
      : timeEntries.filter(entry => myTeam.some(member => member.email === entry.userId));

  return (
    <div className="flex h-dvh overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Sidebar */}
      {renderSidebar()}
      
      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-4 sm:px-6 z-20">
            <div className="flex items-center gap-4">
                <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                    <Menu size={24} />
                </button>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white capitalize truncate">
                    {view.replace('-', ' ')}
                </h2>
            </div>
            
            <div className="flex items-center gap-3">
                <button onClick={toggleTheme} className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <div className="relative hidden sm:block">
                     <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                     <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-500 w-64 text-slate-900 dark:text-white placeholder-slate-500" />
                </div>
                 <button onClick={() => setView('notifications')} className={`relative p-2 rounded-full transition-colors ${view === 'notifications' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                </button>
            </div>
        </header>

        {/* View Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 scroll-smooth">
           {view === 'dashboard' && (
              <div className="max-w-7xl mx-auto animate-fade-in">
                  <DashboardStats 
                    expenses={expenses} 
                    budget={user.budget} 
                    hoursWorkedThisWeek={32}
                    pendingSurveys={surveys.filter(s => s.isActive).length}
                    openJobs={jobs.filter(j => j.status === 'Open').length}
                  />
                  
                  {/* Recent Expenses List in Dashboard */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                          <h3 className="font-bold text-slate-800 dark:text-white">Recent Expenses</h3>
                          <button onClick={() => setView('expenses')} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">View All</button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase text-slate-500 font-medium">
                                <tr>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Merchant</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {expenses.slice(0, 5).map(expense => (
                                    <tr key={expense.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{expense.date}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{expense.merchant}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                                                {expense.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">${expense.amount.toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                                ${expense.status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                                                  expense.status === 'Rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 
                                                  'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                                                {expense.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                      </div>
                  </div>
              </div>
           )}

           {view === 'migo-chat' && (
             <div className="max-w-4xl mx-auto h-full animate-fade-in flex flex-col">
                 <ChatMode />
             </div>
           )}

           {view === 'migo-live' && (
             <div className="h-full animate-fade-in">
                 <LiveMode />
             </div>
           )}

           {view === 'assistant' && (
             <div className="max-w-4xl mx-auto h-full animate-fade-in">
                 <Assistant />
             </div>
           )}

           {view === 'goals' && (
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
           )}

           {view === 'reviews' && (
               <div className="max-w-7xl mx-auto animate-fade-in">
                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                       <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Performance Reviews</h2>
                       <div className="flex gap-2">
                           {isManager && (
                               <div className="flex gap-2 bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                                   <button onClick={() => setActiveReviewTab('my-reviews')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeReviewTab === 'my-reviews' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>My Reviews</button>
                                   <button onClick={() => setActiveReviewTab('team-reviews')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeReviewTab === 'team-reviews' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>Team Reviews</button>
                               </div>
                           )}
                           {user.role === 'Administrator' && (
                               <>
                                <button onClick={() => { setIsTemplateModalOpen(true); }} className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2">
                                    <BookTemplate size={18} /> Manage Templates
                                </button>
                                <button onClick={() => setIsStartCycleModalOpen(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-900/30 flex items-center gap-2">
                                    <Plus size={18} /> Start Cycle
                                </button>
                               </>
                           )}
                       </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {(activeReviewTab === 'my-reviews' 
                           ? reviews.filter(r => r.employeeEmail === user.email)
                           : reviews.filter(r => r.managerEmail === user.email)
                       ).map(review => (
                           <div key={review.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
                               <div className="flex justify-between items-start mb-4">
                                   <div>
                                       <h3 className="font-bold text-slate-900 dark:text-white">{review.period}</h3>
                                       <p className="text-xs text-slate-500">{activeReviewTab === 'team-reviews' ? `Employee: ${review.employeeName}` : `Manager: ${review.managerName}`}</p>
                                   </div>
                                   <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                       review.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                                       review.status === 'Pending Manager' ? 'bg-blue-100 text-blue-700' : 
                                       'bg-amber-100 text-amber-700'
                                   }`}>
                                       {review.status}
                                   </span>
                               </div>
                               
                               <div className="space-y-4 mb-6 flex-1">
                                   {review.status === 'Completed' ? (
                                       <div className="flex items-center gap-2">
                                           <div className="flex text-yellow-400">
                                               {[1,2,3,4,5].map(star => (
                                                   <Star key={star} size={16} fill={star <= (review.managerRating || 0) ? "currentColor" : "none"} className={star <= (review.managerRating || 0) ? "" : "text-slate-300"} />
                                               ))}
                                           </div>
                                           <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Final Rating</span>
                                       </div>
                                   ) : (
                                       <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-sm text-slate-600 dark:text-slate-400 italic">
                                           {review.status === 'Pending Self' ? 'Waiting for self-review submission.' : 'Self-review submitted. Pending manager feedback.'}
                                       </div>
                                   )}
                                   {review.templateId && <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500">Structured Review</span>}
                               </div>

                               <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                                   {(activeReviewTab === 'my-reviews' && review.status === 'Pending Self') || 
                                    (activeReviewTab === 'team-reviews' && review.status === 'Pending Manager') ? (
                                       <button onClick={() => handleOpenReviewModal(review)} className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                                           {activeReviewTab === 'my-reviews' ? 'Complete Self Review' : 'Write Manager Review'}
                                       </button>
                                   ) : (
                                       <button onClick={() => handleOpenReviewModal(review)} className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                           View Details
                                       </button>
                                   )}
                               </div>
                           </div>
                       ))}
                       
                       {(activeReviewTab === 'my-reviews' 
                           ? reviews.filter(r => r.employeeEmail === user.email)
                           : reviews.filter(r => r.managerEmail === user.email)
                       ).length === 0 && (
                           <div className="col-span-3 text-center py-12 text-slate-500">
                               <FileStack size={48} className="mx-auto mb-4 opacity-50"/>
                               <p>No reviews found for this view.</p>
                           </div>
                       )}
                   </div>
               </div>
           )}

           {view === 'expenses' && (
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
           )}

           {view === 'trips' && (
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
           )}

           {view === 'time-absence' && (
               <div className="max-w-7xl mx-auto animate-fade-in">
                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                       <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Time & Absence</h2>
                       <div className="flex gap-2">
                           {isManager && (
                               <div className="flex gap-2 bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                                   <button onClick={() => setTimeAbsenceViewMode('personal')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${timeAbsenceViewMode === 'personal' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>Personal</button>
                                   <button onClick={() => setTimeAbsenceViewMode('team')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${timeAbsenceViewMode === 'team' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>Team Approvals</button>
                               </div>
                           )}
                           <button onClick={() => { setActiveTimeAbsenceTab('time'); setIsTimeModalOpen(true); }} className="px-4 py-2 bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2">
                               <Clock size={18} /> Log Time
                           </button>
                           <button onClick={() => { setActiveTimeAbsenceTab('absence'); setIsAbsenceModalOpen(true); }} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-900/30 flex items-center gap-2">
                               <CalendarDays size={18} /> Request Leave
                           </button>
                       </div>
                   </div>

                   <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                       <div className="border-b border-slate-200 dark:border-slate-800">
                           <nav className="flex -mb-px">
                               <button onClick={() => setActiveTimeAbsenceTab('time')} className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${activeTimeAbsenceTab === 'time' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Timesheet</button>
                               <button onClick={() => setActiveTimeAbsenceTab('absence')} className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${activeTimeAbsenceTab === 'absence' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Absence</button>
                           </nav>
                       </div>
                       
                       {activeTimeAbsenceTab === 'absence' && timeAbsenceViewMode === 'personal' && (
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
                               <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                   <div>
                                       <p className="text-xs text-slate-500 uppercase font-bold">Vacation Days</p>
                                       <p className="text-2xl font-bold text-slate-900 dark:text-white">{calculateLeaveBalance(AbsenceType.VACATION)} <span className="text-slate-400 text-lg font-normal">/ 15</span></p>
                                   </div>
                                   <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600"><Sun size={20}/></div>
                                </div>
                               <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                   <div>
                                       <p className="text-xs text-slate-500 uppercase font-bold">Sick Leave</p>
                                       <p className="text-2xl font-bold text-slate-900 dark:text-white">{calculateLeaveBalance(AbsenceType.SICK)} <span className="text-slate-400 text-lg font-normal">/ 5</span></p>
                                   </div>
                                   <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600"><Heart size={20}/></div>
                               </div>
                           </div>
                       )}

                       <div className="overflow-x-auto">
                           {activeTimeAbsenceTab === 'time' ? (
                               <table className="w-full text-left">
                                   <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase text-slate-500">
                                       <tr>
                                           <th className="px-6 py-4">Date</th>
                                           {timeAbsenceViewMode === 'team' && <th className="px-6 py-4">Employee</th>}
                                           <th className="px-6 py-4">Start</th>
                                           <th className="px-6 py-4">End</th>
                                           <th className="px-6 py-4">Break (m)</th>
                                           <th className="px-6 py-4">Total</th>
                                           <th className="px-6 py-4">Description</th>
                                           <th className="px-6 py-4">Status</th>
                                           <th className="px-6 py-4">Actions</th>
                                       </tr>
                                   </thead>
                                   <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                       {(timeAbsenceViewMode === 'personal' ? timeEntries.filter(t => t.userId === user.email) : teamTimeEntries).map(entry => (
                                           <tr key={entry.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                               <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{entry.date}</td>
                                               {timeAbsenceViewMode === 'team' && <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{entry.userName}</td>}
                                               <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{entry.startTime}</td>
                                               <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{entry.endTime}</td>
                                               <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{entry.breakMinutes || 0}</td>
                                               <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">{entry.totalHours}h</td>
                                               <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 max-w-[200px] truncate">{entry.description}</td>
                                               <td className="px-6 py-4">
                                                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                                       ${entry.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                                                         entry.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                                                         'bg-amber-100 text-amber-800'}`}>
                                                       {entry.status}
                                                   </span>
                                               </td>
                                               <td className="px-6 py-4">
                                                   {timeAbsenceViewMode === 'team' && entry.status === 'Pending' ? (
                                                       <div className="flex gap-2">
                                                           <button onClick={() => setConfirmationModal({ isOpen: true, title: 'Approve Time', message: 'Approve this timesheet entry?', action: 'approve-time', itemId: entry.id })} className="p-1 text-green-600 hover:bg-green-50 rounded"><Check size={18}/></button>
                                                           <button onClick={() => setConfirmationModal({ isOpen: true, title: 'Reject Time', message: 'Reject this timesheet entry?', action: 'reject-time', itemId: entry.id, isDestructive: true })} className="p-1 text-red-600 hover:bg-red-50 rounded"><X size={18}/></button>
                                                       </div>
                                                   ) : timeAbsenceViewMode === 'personal' && entry.status === 'Pending' && (
                                                       <button onClick={() => setConfirmationModal({ isOpen: true, title: 'Delete Entry', message: 'Are you sure you want to delete this pending time entry?', action: 'delete-time-entry', itemId: entry.id, isDestructive: true })} className="text-red-500 hover:text-red-700"><Trash2 size={16}/></button>
                                                   )}
                                               </td>
                                           </tr>
                                       ))}
                                   </tbody>
                               </table>
                           ) : (
                               <table className="w-full text-left">
                                   <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase text-slate-500">
                                       <tr>
                                           <th className="px-6 py-4">Dates</th>
                                           {timeAbsenceViewMode === 'team' && <th className="px-6 py-4">Employee</th>}
                                           <th className="px-6 py-4">Type</th>
                                           <th className="px-6 py-4">Reason</th>
                                           <th className="px-6 py-4">Status</th>
                                           <th className="px-6 py-4">Actions</th>
                                       </tr>
                                   </thead>
                                   <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                       {(timeAbsenceViewMode === 'personal' ? absenceRequests.filter(a => a.userId === user.email) : teamAbsenceRequests).map(req => (
                                           <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                               <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{req.startDate} - {req.endDate}</td>
                                               {timeAbsenceViewMode === 'team' && <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{req.userName}</td>}
                                               <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{req.type}</td>
                                               <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{req.reason}</td>
                                               <td className="px-6 py-4">
                                                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                                       ${req.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                                                         req.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                                                         'bg-amber-100 text-amber-800'}`}>
                                                       {req.status}
                                                   </span>
                                               </td>
                                               <td className="px-6 py-4">
                                                   {timeAbsenceViewMode === 'team' && req.status === 'Pending' ? (
                                                       <div className="flex gap-2">
                                                           <button onClick={() => setConfirmationModal({ isOpen: true, title: 'Approve Absence', message: 'Approve this leave request?', action: 'approve-absence', itemId: req.id })} className="p-1 text-green-600 hover:bg-green-50 rounded"><Check size={18}/></button>
                                                           <button onClick={() => setConfirmationModal({ isOpen: true, title: 'Reject Absence', message: 'Reject this leave request?', action: 'reject-absence', itemId: req.id, isDestructive: true })} className="p-1 text-red-600 hover:bg-red-50 rounded"><X size={18}/></button>
                                                       </div>
                                                   ) : timeAbsenceViewMode === 'personal' && req.status === 'Pending' && (
                                                       <button onClick={() => setConfirmationModal({ isOpen: true, title: 'Cancel Request', message: 'Cancel this pending absence request?', action: 'delete-absence-request', itemId: req.id, isDestructive: true })} className="text-red-500 hover:text-red-700 text-sm font-medium">Cancel</button>
                                                   )}
                                               </td>
                                           </tr>
                                       ))}
                                   </tbody>
                               </table>
                           )}
                       </div>
                   </div>
               </div>
           )}

           {/* ... existing content ... */}

           {view === 'jobs' && (
               <div className="max-w-7xl mx-auto animate-fade-in">
                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                       <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Internal Jobs</h2>
                       {user.role === 'Administrator' && (
                           <button onClick={() => setIsJobModalOpen(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-900/30 flex items-center gap-2">
                               <Plus size={18} /> Post New Job
                           </button>
                       )}
                   </div>
                   
                   <div className="grid grid-cols-1 gap-4">
                       {jobs.map(job => (
                           <div key={job.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                               <div>
                                   <div className="flex items-center gap-3 mb-2">
                                       <h3 className="text-lg font-bold text-slate-900 dark:text-white">{job.title}</h3>
                                       <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${job.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>{job.status}</span>
                                   </div>
                                   <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400 mb-3">
                                       <span className="flex items-center gap-1"><Briefcase size={14}/> {job.department}</span>
                                       <span className="flex items-center gap-1"><MapPin size={14}/> {job.location}</span>
                                       <span className="flex items-center gap-1"><Clock size={14}/> {job.type}</span>
                                       <span className="flex items-center gap-1"><DollarSign size={14}/> {job.salaryRange}</span>
                                   </div>
                                   <p className="text-sm text-slate-500 max-w-2xl">{job.description}</p>
                               </div>
                               <div className="flex gap-3 w-full md:w-auto">
                                   {user.role === 'Administrator' ? (
                                       <>
                                           <button 
                                               onClick={() => { setSelectedJobForApplication(job); setIsApplicationModalOpen(true); }}
                                               className="flex-1 md:flex-none px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                                           >
                                               View Candidates ({applications.filter(a => a.jobId === job.id).length})
                                           </button>
                                           <button 
                                               onClick={() => { setEditingJobId(job.id); setNewJob(job); setIsJobModalOpen(true); }}
                                               className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-50 dark:bg-slate-800 rounded-lg"
                                           >
                                               <Pencil size={18} />
                                           </button>
                                       </>
                                   ) : (
                                       <button 
                                           onClick={() => handleInitiateApply(job)}
                                           disabled={applications.some(a => a.jobId === job.id && a.applicantEmail === user.email)}
                                           className="flex-1 md:flex-none px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                       >
                                           {applications.some(a => a.jobId === job.id && a.applicantEmail === user.email) ? 'Applied' : 'Apply Now'}
                                       </button>
                                   )}
                               </div>
                           </div>
                       ))}
                   </div>
               </div>
           )}

           {view === 'recruitment' && (
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
           )}

           {/* ... existing code ... */}

           {view === 'my-team' && (
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
                               <Users size={48} className="mx-auto text-slate-300 mb-4"/>
                               <p className="text-slate-500">You don't have any direct reports yet.</p>
                           </div>
                       )}
                   </div>
               </div>
           )}

           {view === 'team' && user.role === 'Administrator' && (
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
           )}

           {view === 'recognition' && (
               <div className="max-w-7xl mx-auto animate-fade-in">
                   <div className="flex justify-between items-center mb-6">
                       <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Recognition & Praise</h2>
                       <button onClick={() => setIsPraiseModalOpen(true)} className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors shadow-lg shadow-pink-900/30 flex items-center gap-2">
                           <Award size={18} /> Send Praise
                       </button>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {praiseList.map(praise => (
                           <div key={praise.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                               <div className="flex items-center gap-3 mb-4">
                                   <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                                       {praise.fromUserInitials}
                                   </div>
                                   <div className="flex-1">
                                       <p className="text-sm font-bold text-slate-900 dark:text-white">{praise.fromUserName} <span className="text-slate-400 font-normal">praised</span> {praise.toUserName}</p>
                                       <p className="text-xs text-slate-500">{praise.date}</p>
                                   </div>
                                   <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center">
                                       <Heart size={16} fill="currentColor" />
                                   </div>
                               </div>
                               <div className="mb-4">
                                   <span className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-xs font-bold rounded-md uppercase tracking-wide">
                                       {praise.category}
                                   </span>
                               </div>
                               <p className="text-slate-600 dark:text-slate-300 text-sm italic">"{praise.message}"</p>
                           </div>
                       ))}
                   </div>
               </div>
           )}

           {view === 'surveys' && (
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
           )}

           {view === 'company-settings' && user.role === 'Administrator' && (
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
           )}

           {view === 'settings' && (
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
                                              onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
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
                                              onChange={(e) => setEditedUser({...editedUser, phone: e.target.value})}
                                              readOnly={!isEditingProfile} 
                                              className={`w-full p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm text-slate-700 dark:text-slate-300 ${!isEditingProfile ? 'border-none' : 'border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none'}`} 
                                           />
                                       </div>
                                   </div>
                                   
                                   <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                                       <h4 className="font-bold mb-4 flex items-center gap-2"><AlertTriangle size={16}/> Emergency Contact</h4>
                                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Name</label>
                                                <input 
                                                  type="text" 
                                                  value={editedUser.emergencyContact?.name || ''} 
                                                  onChange={(e) => setEditedUser({...editedUser, emergencyContact: { ...editedUser.emergencyContact || { name: '', relationship: '', phone: '' }, name: e.target.value } })}
                                                  readOnly={!isEditingProfile} 
                                                  className={`w-full p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm text-slate-700 dark:text-slate-300 ${!isEditingProfile ? 'border-none' : 'border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none'}`} 
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Relationship</label>
                                                <input 
                                                  type="text" 
                                                  value={editedUser.emergencyContact?.relationship || ''} 
                                                  onChange={(e) => setEditedUser({...editedUser, emergencyContact: { ...editedUser.emergencyContact || { name: '', relationship: '', phone: '' }, relationship: e.target.value } })}
                                                  readOnly={!isEditingProfile} 
                                                  className={`w-full p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm text-slate-700 dark:text-slate-300 ${!isEditingProfile ? 'border-none' : 'border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none'}`} 
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Phone</label>
                                                <input 
                                                  type="text" 
                                                  value={editedUser.emergencyContact?.phone || ''} 
                                                  onChange={(e) => setEditedUser({...editedUser, emergencyContact: { ...editedUser.emergencyContact || { name: '', relationship: '', phone: '' }, phone: e.target.value } })}
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
                                              onChange={(e) => setEditedUser({...editedUser, employment: { ...editedUser.employment!, jobTitle: e.target.value } })}
                                              readOnly={!isEditingProfile} 
                                              className={`w-full p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm text-slate-700 dark:text-slate-300 ${!isEditingProfile ? 'border-none' : 'border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none'}`} 
                                           />
                                       </div>
                                       <div>
                                           <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Department</label>
                                           <input 
                                              type="text" 
                                              value={editedUser.employment?.department || ''} 
                                              onChange={(e) => setEditedUser({...editedUser, employment: { ...editedUser.employment!, department: e.target.value } })}
                                              readOnly={!isEditingProfile} 
                                              className={`w-full p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm text-slate-700 dark:text-slate-300 ${!isEditingProfile ? 'border-none' : 'border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none'}`} 
                                           />
                                       </div>
                                       <div>
                                           <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Manager</label>
                                           <input 
                                              type="text" 
                                              value={editedUser.employment?.managerName || ''} 
                                              onChange={(e) => setEditedUser({...editedUser, employment: { ...editedUser.employment!, managerName: e.target.value } })}
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
                                              onChange={(e) => setEditedUser({...editedUser, employment: { ...editedUser.employment!, startDate: e.target.value } })}
                                              readOnly={!isEditingProfile} 
                                              className={`w-full p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm text-slate-700 dark:text-slate-300 ${!isEditingProfile ? 'border-none' : 'border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none'}`} 
                                           />
                                       </div>
                                       <div>
                                           <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Location</label>
                                           <input 
                                              type="text" 
                                              value={editedUser.employment?.location || ''} 
                                              onChange={(e) => setEditedUser({...editedUser, employment: { ...editedUser.employment!, location: e.target.value } })}
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
                                           {showSalary ? <EyeOff size={20}/> : <Eye size={20}/>}
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
                                                       <FileText size={20} className="text-slate-400"/>
                                                       <div>
                                                           <p className="text-sm font-medium text-slate-900 dark:text-white">{doc.name}</p>
                                                           <p className="text-xs text-slate-500">{doc.category} • {doc.uploadDate}</p>
                                                       </div>
                                                   </div>
                                                   <button className="text-indigo-600 hover:text-indigo-800 p-2"><Download size={16}/></button>
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
           )}

           {view === 'notifications' && (
               <div className="max-w-3xl mx-auto animate-fade-in">
                   <div className="flex justify-between items-center mb-6">
                       <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Notifications</h2>
                       <button onClick={() => setNotifications(prev => prev.map(n => ({...n, isRead: true})))} className="text-sm text-indigo-600 hover:underline">Mark all as read</button>
                   </div>
                   
                   <div className="space-y-3">
                       {notifications.slice(0, visibleNotificationsCount).map(notif => (
                           <div key={notif.id} className={`p-4 rounded-xl border flex gap-4 transition-colors ${notif.isRead ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800' : 'bg-indigo-50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/30'}`}>
                               <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 
                                   ${notif.type === 'success' ? 'bg-green-100 text-green-600' : 
                                     notif.type === 'alert' ? 'bg-red-100 text-red-600' : 
                                     notif.type === 'warning' ? 'bg-amber-100 text-amber-600' : 
                                     'bg-blue-100 text-blue-600'}`}>
                                   {notif.type === 'success' ? <CheckCircle2 size={20}/> : 
                                    notif.type === 'alert' ? <AlertTriangle size={20}/> : 
                                    notif.type === 'warning' ? <Clock size={20}/> : <Info size={20}/>}
                               </div>
                               <div>
                                   <div className="flex justify-between items-start w-full">
                                       <h4 className={`font-bold text-sm ${notif.isRead ? 'text-slate-800 dark:text-slate-200' : 'text-slate-900 dark:text-white'}`}>{notif.title}</h4>
                                       <span className="text-xs text-slate-400 ml-4 whitespace-nowrap">{notif.date}</span>
                                   </div>
                                   <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{notif.message}</p>
                               </div>
                           </div>
                       ))}
                   </div>
                   
                   {notifications.length > visibleNotificationsCount && (
                       <div className="mt-6 text-center">
                           <button onClick={() => setVisibleNotificationsCount(prev => prev + 10)} className="px-6 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                               Load More
                           </button>
                       </div>
                   )}
               </div>
           )}
        </main>
      </div>

      {/* --- Modals --- */}
      
      {/* Trip Modal */}
      {isTripModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-800">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                      <h3 className="font-bold text-lg text-slate-800 dark:text-white">{editingTripId ? 'Edit Trip' : 'Plan New Trip'}</h3>
                      <button onClick={() => setIsTripModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                  </div>
                  <div className="p-6 space-y-4">
                      <div>
                          <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Destination</label>
                          <input type="text" value={newTrip.destination} onChange={e => setNewTrip({...newTrip, destination: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" placeholder="City, Country"/>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Start Date</label>
                              <input type="date" value={newTrip.startDate} onChange={e => setNewTrip({...newTrip, startDate: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"/>
                          </div>
                          <div>
                              <label className="block text-xs font-medium text-slate-500 uppercase mb-1">End Date</label>
                              <input type="date" value={newTrip.endDate} onChange={e => setNewTrip({...newTrip, endDate: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"/>
                          </div>
                      </div>
                      <div>
                          <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Purpose</label>
                          <input type="text" value={newTrip.purpose} onChange={e => setNewTrip({...newTrip, purpose: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" placeholder="Conference, Client Meeting..."/>
                      </div>
                      <div>
                          <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Budget ($)</label>
                          <input type="number" value={newTrip.budget} onChange={e => setNewTrip({...newTrip, budget: Number(e.target.value)})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"/>
                      </div>
                      <button onClick={handleSaveTrip} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">Save Trip</button>
                  </div>
              </div>
          </div>
      )}

      {/* Itinerary Modal */}
      {isItineraryModalOpen && selectedTripForItinerary && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-indigo-50 dark:bg-indigo-900/20">
                      <div>
                          <h3 className="font-bold text-lg text-indigo-900 dark:text-indigo-100">Trip Itinerary</h3>
                          <p className="text-xs text-indigo-700 dark:text-indigo-300">{selectedTripForItinerary.destination}</p>
                      </div>
                      <div className="flex items-center gap-2">
                          <button onClick={() => generateItineraryPDF(selectedTripForItinerary, generatedItinerary)} className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg" title="Download PDF"><Download size={20}/></button>
                          <button onClick={() => setIsItineraryModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                      </div>
                  </div>
                  <div className="p-6 overflow-y-auto">
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                          <MarkdownRenderer content={generatedItinerary} />
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Time Entry Modal */}
      {isTimeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-800">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                      <h3 className="font-bold text-lg text-slate-800 dark:text-white">Log Time</h3>
                      <button onClick={() => setIsTimeModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                  </div>
                  <div className="p-6 space-y-4">
                      <div>
                          <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Date</label>
                          <input type="date" value={newTimeEntry.date} onChange={e => setNewTimeEntry({...newTimeEntry, date: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"/>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Start Time</label>
                              <input type="time" value={newTimeEntry.startTime} onChange={e => setNewTimeEntry({...newTimeEntry, startTime: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"/>
                          </div>
                          <div>
                              <label className="block text-xs font-medium text-slate-500 uppercase mb-1">End Time</label>
                              <input type="time" value={newTimeEntry.endTime} onChange={e => setNewTimeEntry({...newTimeEntry, endTime: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"/>
                          </div>
                      </div>
                      <div>
                          <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Break (Minutes)</label>
                          <input type="number" value={newTimeEntry.breakMinutes} onChange={e => setNewTimeEntry({...newTimeEntry, breakMinutes: Number(e.target.value)})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"/>
                      </div>
                      <div>
                          <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Description</label>
                          <textarea value={newTimeEntry.description} onChange={e => setNewTimeEntry({...newTimeEntry, description: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" rows={3}/>
                      </div>
                      <button onClick={handleSaveTimeEntry} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">Submit Time</button>
                  </div>
              </div>
          </div>
      )}

      {/* Absence Modal */}
      {isAbsenceModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-800">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                      <h3 className="font-bold text-lg text-slate-800 dark:text-white">Request Leave</h3>
                      <button onClick={() => setIsAbsenceModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                  </div>
                  <div className="p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Start Date</label>
                              <input type="date" value={newAbsence.startDate} onChange={e => setNewAbsence({...newAbsence, startDate: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"/>
                          </div>
                          <div>
                              <label className="block text-xs font-medium text-slate-500 uppercase mb-1">End Date</label>
                              <input type="date" value={newAbsence.endDate} onChange={e => setNewAbsence({...newAbsence, endDate: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"/>
                          </div>
                      </div>
                      <div>
                          <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Type</label>
                          <select value={newAbsence.type} onChange={e => setNewAbsence({...newAbsence, type: e.target.value as any})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm">
                              {Object.values(AbsenceType).map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                      </div>
                      <div>
                          <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Reason</label>
                          <textarea value={newAbsence.reason} onChange={e => setNewAbsence({...newAbsence, reason: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" rows={3}/>
                      </div>
                      <button onClick={handleSaveAbsence} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">Submit Request</button>
                  </div>
              </div>
          </div>
      )}

      {/* Expense Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
               <h3 className="font-bold text-lg text-slate-800 dark:text-white">Add Expense</h3>
               <button onClick={() => setIsExpenseModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
            </div>
            <div className="p-6 overflow-y-auto">
               {expenseEntryMode === 'scan' ? (
                   <>
                       <ReceiptUploader onAnalysisComplete={handleReceiptAnalysis} />
                       <div className="mt-6 text-center">
                           <p className="text-sm text-slate-500 mb-2">Or enter details manually</p>
                           <button onClick={() => setExpenseEntryMode('manual')} className="text-indigo-600 hover:underline font-medium text-sm">
                               Switch to Manual Entry
                           </button>
                       </div>
                   </>
               ) : (
                   <div className="space-y-4">
                       <div>
                           <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Merchant</label>
                           <input type="text" value={newManualExpense.merchant} onChange={e => setNewManualExpense({...newManualExpense, merchant: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" placeholder="e.g. Starbucks"/>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                           <div>
                               <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Amount</label>
                               <input type="number" value={newManualExpense.amount} onChange={e => setNewManualExpense({...newManualExpense, amount: Number(e.target.value)})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" placeholder="0.00"/>
                           </div>
                           <div>
                               <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Currency</label>
                               <select value={newManualExpense.currency} onChange={e => setNewManualExpense({...newManualExpense, currency: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm">
                                   <option value="USD">USD</option>
                                   <option value="EUR">EUR</option>
                                   <option value="GBP">GBP</option>
                               </select>
                           </div>
                       </div>
                       <div>
                           <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Date</label>
                           <input type="date" value={newManualExpense.date} onChange={e => setNewManualExpense({...newManualExpense, date: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"/>
                       </div>
                       <div>
                           <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Category</label>
                           <select value={newManualExpense.category} onChange={e => setNewManualExpense({...newManualExpense, category: e.target.value as ExpenseCategory})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm">
                               {Object.values(ExpenseCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                           </select>
                       </div>
                       <div>
                           <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Description</label>
                           <input type="text" value={newManualExpense.description} onChange={e => setNewManualExpense({...newManualExpense, description: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" placeholder="Optional description"/>
                       </div>
                       <div className="flex gap-3 pt-2">
                           <button onClick={() => setExpenseEntryMode('scan')} className="flex-1 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800">Back to Scan</button>
                           <button onClick={handleSaveManualExpense} className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Save Expense</button>
                       </div>
                   </div>
               )}
            </div>
          </div>
        </div>
      )}

      {/* Manage Team Modal */}
      {isManageTeamModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200 dark:border-slate-800">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                      <h3 className="font-bold text-lg text-slate-800 dark:text-white">{manageTeamMode === 'assign_manager' ? 'Assign Manager' : 'Add Team Member'}</h3>
                      <button onClick={() => setIsManageTeamModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                  </div>
                  <div className="p-6 space-y-4">
                      {manageTeamMode === 'assign_manager' && selectedTeamMember && (
                          <>
                              <p className="text-sm text-slate-600 dark:text-slate-300">Assigning manager for <span className="font-bold">{selectedTeamMember.name}</span></p>
                              <div>
                                  <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Select Manager</label>
                                  <select value={newManagerEmail} onChange={e => setNewManagerEmail(e.target.value)} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm">
                                      <option value="">Select a manager...</option>
                                      {allUsers.filter(u => u.email !== selectedTeamMember.email).map(u => (
                                          <option key={u.email} value={u.email}>{u.name} ({u.email})</option>
                                      ))}
                                  </select>
                              </div>
                              <button onClick={() => handleSaveTeamAssignment(selectedTeamMember.email, newManagerEmail)} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">Save Assignment</button>
                          </>
                      )}
                      {manageTeamMode === 'add_member' && (
                          <>
                              <div>
                                  <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Select Employee</label>
                                  <select value={newTeamMemberEmail} onChange={e => setNewTeamMemberEmail(e.target.value)} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm">
                                      <option value="">Select an employee...</option>
                                      {allUsers.filter(u => u.email !== user.email && u.employment?.managerEmail !== user.email).map(u => (
                                          <option key={u.email} value={u.email}>{u.name} ({u.email})</option>
                                      ))}
                                  </select>
                              </div>
                              <button onClick={() => handleSaveTeamAssignment(newTeamMemberEmail, user.email)} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">Add to My Team</button>
                          </>
                      )}
                  </div>
              </div>
          </div>
      )}

      {/* Invite User Modal */}
      {isInviteUserModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-800">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                      <h3 className="font-bold text-lg text-slate-800 dark:text-white">Invite New User</h3>
                      <button onClick={() => setIsInviteUserModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                  </div>
                  <div className="p-6 space-y-4">
                      <div>
                          <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Full Name</label>
                          <input type="text" value={inviteForm.name} onChange={e => setInviteForm({...inviteForm, name: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"/>
                      </div>
                      <div>
                          <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Email</label>
                          <input type="email" value={inviteForm.email} onChange={e => setInviteForm({...inviteForm, email: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"/>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Role</label>
                              <select value={inviteForm.role} onChange={e => setInviteForm({...inviteForm, role: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm">
                                  <option value="User">User</option>
                                  <option value="Administrator">Administrator</option>
                              </select>
                          </div>
                          <div>
                              <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Department</label>
                              <input type="text" value={inviteForm.department} onChange={e => setInviteForm({...inviteForm, department: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"/>
                          </div>
                      </div>
                      <div>
                          <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Job Title</label>
                          <input type="text" value={inviteForm.jobTitle} onChange={e => setInviteForm({...inviteForm, jobTitle: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"/>
                      </div>
                      <button onClick={handleSendInvite} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">Send Invite</button>
                  </div>
              </div>
          </div>
      )}

      {/* Job Modal */}
      {isJobModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 dark:border-slate-800">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                      <h3 className="font-bold text-lg text-slate-800 dark:text-white">{editingJobId ? 'Edit Job' : 'Post New Job'}</h3>
                      <button onClick={() => setIsJobModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                  </div>
                  <div className="p-6 space-y-4">
                      <div>
                          <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Job Title</label>
                          <input type="text" value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"/>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Department</label>
                              <input type="text" value={newJob.department} onChange={e => setNewJob({...newJob, department: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"/>
                          </div>
                          <div>
                              <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Location</label>
                              <input type="text" value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"/>
                          </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Type</label>
                              <select value={newJob.type} onChange={e => setNewJob({...newJob, type: e.target.value as any})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm">
                                  <option value="Full-time">Full-time</option>
                                  <option value="Part-time">Part-time</option>
                                  <option value="Contract">Contract</option>
                                  <option value="Remote">Remote</option>
                                  <option value="Internship">Internship</option>
                                  <option value="Working Student">Working Student</option>
                              </select>
                          </div>
                          <div>
                              <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Salary Range</label>
                              <input type="text" value={newJob.salaryRange} onChange={e => setNewJob({...newJob, salaryRange: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"/>
                          </div>
                      </div>
                      <div>
                          <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Description</label>
                          <textarea value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" rows={4}/>
                      </div>
                      <button onClick={handleSaveJob} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">Save Job</button>
                  </div>
              </div>
          </div>
      )}

      {/* Application List Modal */}
      {isApplicationModalOpen && selectedJobForApplication && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-indigo-50 dark:bg-indigo-900/20">
                      <div>
                          <h3 className="font-bold text-lg text-indigo-900 dark:text-indigo-100">Applicants for {selectedJobForApplication.title}</h3>
                      </div>
                      <button onClick={() => setIsApplicationModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                  </div>
                  <div className="p-6 overflow-y-auto">
                      {applications.filter(a => a.jobId === selectedJobForApplication.id).length > 0 ? (
                           <div className="space-y-4">
                               {applications.filter(a => a.jobId === selectedJobForApplication.id).map(app => (
                                   <div key={app.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl flex justify-between items-center">
                                       <div>
                                           <p className="font-bold text-slate-900 dark:text-white">{app.applicantName}</p>
                                           <p className="text-sm text-slate-500">{app.applicantEmail}</p>
                                           {app.coverNote && <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 italic">"{app.coverNote}"</p>}
                                       </div>
                                       <div className="text-right">
                                           <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-1 ${app.status === 'Hired' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>{app.status}</span>
                                           <p className="text-xs text-slate-400">{app.appliedDate}</p>
                                       </div>
                                   </div>
                               ))}
                           </div>
                      ) : (
                          <p className="text-center text-slate-500">No applicants yet.</p>
                      )}
                  </div>
              </div>
           </div>
      )}

      {/* Apply Job Modal */}
      {isApplyModalOpen && selectedJobToApply && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-800">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                      <div>
                          <h3 className="font-bold text-lg text-slate-800 dark:text-white">Apply for {selectedJobToApply.title}</h3>
                          <p className="text-xs text-slate-500">{selectedJobToApply.location}</p>
                      </div>
                      <button onClick={() => setIsApplyModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                  </div>
                  <div className="p-6 space-y-4">
                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                              {user.avatarInitials}
                          </div>
                          <div>
                              <p className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</p>
                              <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                          <span className="ml-auto text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">Internal</span>
                      </div>
                      
                      {/* CV Upload */}
                      <div>
                          <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Attach CV / Resume</label>
                          <div 
                              onClick={() => cvInputRef.current?.click()}
                              className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-4 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                          >
                              <input 
                                  type="file" 
                                  ref={cvInputRef} 
                                  className="hidden" 
                                  accept=".pdf,.doc,.docx" 
                                  onChange={handleCvChange}
                              />
                              {applicationCv ? (
                                  <div className="flex items-center justify-center gap-2 text-indigo-600">
                                      <FileText size={20}/>
                                      <span className="text-sm font-medium">{applicationCv.name}</span>
                                  </div>
                              ) : (
                                  <div className="flex flex-col items-center gap-1 text-slate-500">
                                      <Upload size={20}/>
                                      <span className="text-sm">Click to upload CV</span>
                                  </div>
                              )}
                          </div>
                      </div>

                      <div>
                          <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Cover Note (Optional)</label>
                          <textarea 
                              value={applicationNote} 
                              onChange={e => setApplicationNote(e.target.value)} 
                              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" 
                              rows={3} 
                              placeholder="Why are you a good fit for this role?"
                          />
                      </div>
                      <button onClick={handleConfirmApply} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">Submit Application</button>
                  </div>
              </div>
          </div>
      )}

      {/* Praise Modal */}
      {isPraiseModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-800">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-pink-50 dark:bg-pink-900/20">
                      <h3 className="font-bold text-lg text-pink-900 dark:text-pink-100 flex items-center gap-2"><Heart size={20} fill="currentColor"/> Send Praise</h3>
                      <button onClick={() => setIsPraiseModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                  </div>
                  <div className="p-6 space-y-4">
                      <div>
                          <label className="block text-xs font-medium text-slate-500 uppercase mb-1">To</label>
                          <select value={newPraise.toUserEmail} onChange={e => setNewPraise({...newPraise, toUserEmail: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm">
                              <option value="">Select teammate...</option>
                              {allUsers.filter(u => u.email !== user.email).map(u => (
                                  <option key={u.email} value={u.email}>{u.name}</option>
                              ))}
                          </select>
                      </div>
                      <div>
                          <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Category</label>
                          <div className="flex flex-wrap gap-2">
                              {['Teamwork', 'Innovation', 'Leadership', 'Dedication', 'Helpful'].map(cat => (
                                  <button 
                                      key={cat}
                                      onClick={() => setNewPraise({...newPraise, category: cat as any})}
                                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${newPraise.category === cat ? 'bg-pink-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                                  >
                                      {cat}
                                  </button>
                              ))}
                          </div>
                      </div>
                      <div>
                          <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Message</label>
                          <textarea value={newPraise.message} onChange={e => setNewPraise({...newPraise, message: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" rows={3} placeholder="What did they do great?"/>
                      </div>
                      <button onClick={handleSendPraise} className="w-full py-3 bg-pink-600 text-white rounded-xl font-medium hover:bg-pink-700 transition-colors">Send Praise</button>
                  </div>
              </div>
          </div>
      )}

      {/* Create Survey Modal */}
      {isCreateSurveyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                      <h3 className="font-bold text-lg text-slate-800 dark:text-white">Create New Survey</h3>
                      <button onClick={() => setIsCreateSurveyModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                  </div>
                  <div className="p-6 overflow-y-auto space-y-6">
                      <div className="space-y-4">
                          <div>
                              <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Title</label>
                              <input type="text" value={newSurvey.title} onChange={e => setNewSurvey({...newSurvey, title: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"/>
                          </div>
                          <div>
                              <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Description</label>
                              <textarea value={newSurvey.description} onChange={e => setNewSurvey({...newSurvey, description: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" rows={2}/>
                          </div>
                      </div>
                      
                      <div>
                          <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-2">Questions</h4>
                          <div className="space-y-3">
                              {newSurvey.questions.map((q, idx) => (
                                  <div key={q.id} className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg flex gap-3 items-start">
                                      <span className="text-slate-400 font-mono text-sm pt-2">Q{idx+1}</span>
                                      <div className="flex-1 space-y-2">
                                          <input type="text" value={q.text} onChange={e => handleUpdateQuestion(q.id, 'text', e.target.value)} placeholder="Question text" className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"/>
                                          <select value={q.type} onChange={e => handleUpdateQuestion(q.id, 'type', e.target.value)} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm">
                                              <option value="rating">Rating (1-5)</option>
                                              <option value="text">Text Response</option>
                                          </select>
                                      </div>
                                      <button onClick={() => handleRemoveQuestion(q.id)} className="text-red-400 hover:text-red-600 pt-2"><Trash2 size={16}/></button>
                                  </div>
                              ))}
                          </div>
                          <button onClick={handleAddQuestion} className="mt-3 text-indigo-600 hover:underline text-sm font-medium flex items-center gap-1"><Plus size={16}/> Add Question</button>
                      </div>
                  </div>
                  <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                      <button onClick={handleSaveSurvey} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">Launch Survey</button>
                  </div>
              </div>
          </div>
      )}

      {/* Assign Interview Modal */}
      {isAssignInterviewerModalOpen && selectedApplication && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-800">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                      <h3 className="font-bold text-lg text-slate-800 dark:text-white">Schedule Interview</h3>
                      <button onClick={() => setIsAssignInterviewerModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                  </div>
                  <div className="p-6 space-y-4">
                      <p className="text-sm text-slate-600 dark:text-slate-400">Candidate: <span className="font-bold text-slate-900 dark:text-white">{selectedApplication.applicantName}</span></p>
                      <div>
                          <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Interviewer</label>
                          <select value={newInterview.interviewerEmail} onChange={e => setNewInterview({...newInterview, interviewerEmail: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm">
                              <option value="">Select Employee...</option>
                              {allUsers.map(u => <option key={u.email} value={u.email}>{u.name}</option>)}
                          </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Date</label>
                              <input type="date" value={newInterview.date} onChange={e => setNewInterview({...newInterview, date: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"/>
                          </div>
                          <div>
                              <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Time</label>
                              <input type="time" value={newInterview.time} onChange={e => setNewInterview({...newInterview, time: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"/>
                          </div>
                      </div>
                      <button onClick={handleScheduleInterview} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">Confirm Schedule</button>
                  </div>
              </div>
           </div>
      )}
      
      {/* Feedback Modal */}
      {isFeedbackModalOpen && selectedApplication && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-800">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                      <h3 className="font-bold text-lg text-slate-800 dark:text-white">Interview Feedback</h3>
                      <button onClick={() => setIsFeedbackModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                  </div>
                  <div className="p-6 space-y-4">
                       <p className="text-sm text-slate-600 dark:text-slate-400">Candidate: <span className="font-bold text-slate-900 dark:text-white">{selectedApplication.applicantName}</span></p>
                       <div>
                           <label className="block text-xs font-medium text-slate-500 uppercase mb-2">Recommendation</label>
                           <div className="flex gap-2">
                               <button onClick={() => setFeedbackForm({...feedbackForm, sentiment: 'Positive'})} className={`flex-1 py-2 rounded-lg text-sm font-medium border ${feedbackForm.sentiment === 'Positive' ? 'bg-green-100 border-green-500 text-green-700' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}>Strong Hire</button>
                               <button onClick={() => setFeedbackForm({...feedbackForm, sentiment: 'Neutral'})} className={`flex-1 py-2 rounded-lg text-sm font-medium border ${feedbackForm.sentiment === 'Neutral' ? 'bg-amber-100 border-amber-500 text-amber-700' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}>Neutral</button>
                               <button onClick={() => setFeedbackForm({...feedbackForm, sentiment: 'Negative'})} className={`flex-1 py-2 rounded-lg text-sm font-medium border ${feedbackForm.sentiment === 'Negative' ? 'bg-red-100 border-red-500 text-red-700' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}>No Hire</button>
                           </div>
                       </div>
                       <div>
                           <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Notes</label>
                           <textarea value={feedbackForm.notes} onChange={e => setFeedbackForm({...feedbackForm, notes: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" rows={4} placeholder="Key strengths, weaknesses..."/>
                       </div>
                       <button onClick={handleSubmitFeedback} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">Submit Feedback</button>
                  </div>
              </div>
           </div>
      )}

      {/* Team Member Profile Modal */}
      {isTeamMemberProfileModalOpen && selectedTeamMemberProfile && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
               <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800">
                   <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-indigo-50 dark:bg-indigo-900/20">
                       <h3 className="font-bold text-lg text-indigo-900 dark:text-indigo-100">Employee Profile</h3>
                       <button onClick={() => setIsTeamMemberProfileModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                   </div>
                   <div className="p-6 overflow-y-auto space-y-6">
                       <div className="flex items-center gap-4">
                           <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                               {selectedTeamMemberProfile.avatarInitials}
                           </div>
                           <div>
                               <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedTeamMemberProfile.name}</h2>
                               <p className="text-slate-500">{selectedTeamMemberProfile.employment?.jobTitle} • {selectedTeamMemberProfile.email}</p>
                           </div>
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                               <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-3">Employment Details</h4>
                               <div className="space-y-2 text-sm">
                                   <div className="flex justify-between"><span className="text-slate-500">Department</span> <span className="text-slate-900 dark:text-white">{selectedTeamMemberProfile.employment?.department}</span></div>
                                   <div className="flex justify-between"><span className="text-slate-500">Location</span> <span className="text-slate-900 dark:text-white">{selectedTeamMemberProfile.employment?.location}</span></div>
                                   <div className="flex justify-between"><span className="text-slate-500">Start Date</span> <span className="text-slate-900 dark:text-white">{selectedTeamMemberProfile.employment?.startDate}</span></div>
                                   <div className="flex justify-between"><span className="text-slate-500">Type</span> <span className="text-slate-900 dark:text-white">{selectedTeamMemberProfile.employment?.employmentType}</span></div>
                               </div>
                           </div>
                           <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                               <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-3">Contact</h4>
                               <div className="space-y-2 text-sm">
                                   <div className="flex justify-between"><span className="text-slate-500">Phone</span> <span className="text-slate-900 dark:text-white">{selectedTeamMemberProfile.phone || 'N/A'}</span></div>
                                   <div className="flex justify-between"><span className="text-slate-500">Emergency</span> <span className="text-slate-900 dark:text-white">{selectedTeamMemberProfile.emergencyContact?.name || 'N/A'}</span></div>
                               </div>
                           </div>
                       </div>

                       <div>
                           <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-3">Documents</h4>
                           {selectedTeamMemberProfile.documents && selectedTeamMemberProfile.documents.length > 0 ? (
                               <div className="space-y-2">
                                   {selectedTeamMemberProfile.documents.map(doc => (
                                       <div key={doc.id} className="flex items-center justify-between p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm">
                                           <div className="flex items-center gap-2">
                                               <FileText size={16} className="text-slate-400"/>
                                               <span className="text-slate-700 dark:text-slate-300">{doc.name}</span>
                                           </div>
                                           <span className="text-xs text-slate-500">{doc.category}</span>
                                       </div>
                                   ))}
                               </div>
                           ) : <p className="text-sm text-slate-500 italic">No documents available.</p>}
                       </div>
                   </div>
               </div>
           </div>
      )}

      {/* Review Template Modal (Create/Edit) */}
      {isTemplateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                      <h3 className="font-bold text-lg text-slate-800 dark:text-white">Create Review Template</h3>
                      <button onClick={() => setIsTemplateModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                  </div>
                  <div className="p-6 overflow-y-auto space-y-4">
                      <div>
                          <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Template Name</label>
                          <input type="text" value={newTemplate.name} onChange={e => setNewTemplate({...newTemplate, name: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" placeholder="e.g. Engineering Q3 Review"/>
                      </div>
                      <div>
                          <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Target Role</label>
                          <select value={newTemplate.role} onChange={e => setNewTemplate({...newTemplate, role: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm">
                              {Object.keys(ROLE_BASED_QUESTIONS).map(role => (
                                  <option key={role} value={role}>{role}</option>
                              ))}
                          </select>
                      </div>
                      
                      <div>
                          <div className="flex justify-between items-center mb-2">
                              <h4 className="font-bold text-sm text-slate-800 dark:text-white">Questions</h4>
                              <button onClick={() => handleLoadExampleQuestions(newTemplate.role)} className="text-xs text-indigo-600 hover:underline">Load Examples</button>
                          </div>
                          <div className="space-y-2">
                              {newTemplate.questions.map((q, idx) => (
                                  <div key={idx} className="flex gap-2">
                                      <input 
                                          type="text" 
                                          value={q} 
                                          onChange={(e) => {
                                              const updated = [...newTemplate.questions];
                                              updated[idx] = e.target.value;
                                              setNewTemplate({...newTemplate, questions: updated});
                                          }}
                                          className="flex-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                                      />
                                      <button onClick={() => {
                                          const updated = newTemplate.questions.filter((_, i) => i !== idx);
                                          setNewTemplate({...newTemplate, questions: updated});
                                      }} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                                  </div>
                              ))}
                          </div>
                          <button onClick={() => setNewTemplate({...newTemplate, questions: [...newTemplate.questions, '']})} className="mt-2 text-indigo-600 hover:underline text-sm font-medium flex items-center gap-1"><Plus size={16}/> Add Custom Question</button>
                      </div>
                  </div>
                  <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                      <button onClick={handleSaveTemplate} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">Save Template</button>
                  </div>
              </div>
          </div>
      )}

      {/* Start Cycle Modal */}
      {isStartCycleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-800">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                      <h3 className="font-bold text-lg text-slate-800 dark:text-white">Start Review Cycle</h3>
                      <button onClick={() => setIsStartCycleModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                  </div>
                  <div className="p-6 space-y-4">
                      <div>
                          <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Period Name</label>
                          <input type="text" value={startCycleForm.period} onChange={e => setStartCycleForm({...startCycleForm, period: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" placeholder="e.g. 2024 Q1 Performance"/>
                      </div>
                      <div>
                          <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Select Template</label>
                          <select value={startCycleForm.templateId} onChange={e => setStartCycleForm({...startCycleForm, templateId: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm">
                              <option value="">Select a template...</option>
                              {reviewTemplates.map(t => (
                                  <option key={t.id} value={t.id}>{t.name} ({t.role})</option>
                              ))}
                          </select>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-xs text-blue-700 dark:text-blue-300">
                          This will create pending reviews for all eligible employees based on the selected template.
                      </div>
                      <button onClick={handleStartReviewCycle} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">Launch Cycle</button>
                  </div>
              </div>
          </div>
      )}

      {/* Create Goal Modal */}
      {isGoalModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-800">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                      <h3 className="font-bold text-lg text-slate-800 dark:text-white">Set New Goal</h3>
                      <button onClick={() => setIsGoalModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                  </div>
                  <div className="p-6 space-y-4">
                      <div>
                          <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Goal Title</label>
                          <input type="text" value={newGoal.title} onChange={e => setNewGoal({...newGoal, title: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" placeholder="e.g. Increase Sales by 10%"/>
                      </div>
                      <div>
                          <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Description</label>
                          <textarea value={newGoal.description} onChange={e => setNewGoal({...newGoal, description: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" rows={3} placeholder="Details about the goal..."/>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Type</label>
                              <select value={newGoal.type} onChange={e => setNewGoal({...newGoal, type: e.target.value as any})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm">
                                  <option value="Business">Business</option>
                                  <option value="Personal">Personal Development</option>
                              </select>
                          </div>
                          <div>
                              <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Visibility</label>
                              <select value={newGoal.visibility} onChange={e => setNewGoal({...newGoal, visibility: e.target.value as any})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm">
                                  <option value="Manager">Manager Only</option>
                                  <option value="Public">Public (Team)</option>
                              </select>
                          </div>
                      </div>
                      <div>
                          <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Due Date</label>
                          <input type="date" value={newGoal.dueDate} onChange={e => setNewGoal({...newGoal, dueDate: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"/>
                      </div>
                      <button onClick={handleSaveGoal} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">Create Goal</button>
                  </div>
              </div>
          </div>
      )}

      {/* Document Upload Modal */}
      {isDocumentUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-800">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                      <h3 className="font-bold text-lg text-slate-800 dark:text-white">Upload Document</h3>
                      <button onClick={() => setIsDocumentUploadModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                  </div>
                  <div className="p-6 space-y-4">
                      <div 
                          onClick={() => documentInputRef.current?.click()}
                          className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                          <input 
                              type="file" 
                              ref={documentInputRef} 
                              className="hidden" 
                              onChange={handleDocumentFileChange}
                          />
                          {newDocumentFile ? (
                              <div className="flex flex-col items-center gap-2 text-indigo-600">
                                  <FileText size={32}/>
                                  <span className="text-sm font-medium">{newDocumentFile.name}</span>
                              </div>
                          ) : (
                              <div className="flex flex-col items-center gap-2 text-slate-500">
                                  <Upload size={32}/>
                                  <span className="text-sm">Click to upload file</span>
                              </div>
                          )}
                      </div>
                      <div>
                          <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Document Name</label>
                          <input type="text" value={newDocumentForm.name} onChange={e => setNewDocumentForm({...newDocumentForm, name: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"/>
                      </div>
                      <div>
                          <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Category</label>
                          <select value={newDocumentForm.category} onChange={e => setNewDocumentForm({...newDocumentForm, category: e.target.value as any})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm">
                              <option value="Contract">Contract</option>
                              <option value="ID">ID</option>
                              <option value="Tax">Tax</option>
                              <option value="Other">Other</option>
                          </select>
                      </div>
                      <button onClick={handleSaveDocument} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">Upload</button>
                  </div>
              </div>
          </div>
      )}

      {/* Password Reset Modal */}
      {isResetPasswordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-800">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                      <h3 className="font-bold text-lg text-slate-800 dark:text-white">Reset Password</h3>
                      <button onClick={() => setIsResetPasswordModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                  </div>
                  <div className="p-6 space-y-4">
                      <div>
                          <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Current Password</label>
                          <input type="password" value={resetPasswordForm.current} onChange={e => setResetPasswordForm({...resetPasswordForm, current: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"/>
                      </div>
                      <div>
                          <label className="block text-xs font-medium text-slate-500 uppercase mb-1">New Password</label>
                          <input type="password" value={resetPasswordForm.new} onChange={e => setResetPasswordForm({...resetPasswordForm, new: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"/>
                      </div>
                      <div>
                          <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Confirm New Password</label>
                          <input type="password" value={resetPasswordForm.confirm} onChange={e => setResetPasswordForm({...resetPasswordForm, confirm: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"/>
                      </div>
                      <button onClick={handleResetPassword} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">Update Password</button>
                  </div>
              </div>
          </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal 
          isOpen={confirmationModal.isOpen}
          title={confirmationModal.title}
          message={confirmationModal.message}
          isDestructive={confirmationModal.isDestructive}
          onConfirm={handleConfirmationAction}
          onCancel={() => setConfirmationModal({ ...confirmationModal, isOpen: false })}
      />

    </div>
  );
}