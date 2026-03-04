const fs = require('fs');
const path = require('path');

const appFile = path.join(__dirname, 'App.tsx');
let content = fs.readFileSync(appFile, 'utf8');

const features = [
    {
        name: 'MyTeam', dir: 'MyTeam',
        start: "{view === 'my-team' && (",
        end: "                           </div>\n                       )}\n                   </div>\n               </div>\n           )}"
    },
    {
        name: 'ManageTeam', dir: 'Admin',
        start: "{view === 'team' && user.role === 'Administrator' && (",
        end: "                       </div>\n                   </div>\n               </div>\n           )}"
    },
    {
        name: 'CompanySettings', dir: 'Admin',
        start: "{view === 'company-settings' && user.role === 'Administrator' && (",
        end: "                               </div>\n                           </div>\n                       </div>\n                   </div>\n               </div>\n           )}"
    }
];

features.forEach(f => {
    const startIndex = content.indexOf(f.start);
    if (startIndex === -1) {
        console.log(`Could not find start block for ${f.name}`);
        return;
    }

    const endIndex = content.indexOf(f.end, startIndex);
    if (endIndex === -1) {
        console.log(`Could not find end block for ${f.name}`);
        return;
    }

    const fullMatch = content.substring(startIndex, endIndex + f.end.length);
    const block = fullMatch.substring(f.start.length, fullMatch.length - 1); // remove trailing )

    const componentCode = `import React from 'react';
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

export default function ${f.name}(props: any) {
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
    ${block}
  );
}
`;
    const dirPath = path.join(__dirname, 'features', f.dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(path.join(dirPath, `${f.name}.tsx`), componentCode);

    let replacement = '';
    if (f.name === 'MyTeam') replacement = `{view === 'my-team' && <React.Suspense fallback={<div className="p-8 text-center text-slate-500">Loading...</div>}><${f.name} {...appProps} /></React.Suspense>}`;
    else if (f.name === 'ManageTeam') replacement = `{view === 'team' && user.role === 'Administrator' && <React.Suspense fallback={<div className="p-8 text-center text-slate-500">Loading...</div>}><${f.name} {...appProps} /></React.Suspense>}`;
    else if (f.name === 'CompanySettings') replacement = `{view === 'company-settings' && user.role === 'Administrator' && <React.Suspense fallback={<div className="p-8 text-center text-slate-500">Loading...</div>}><${f.name} {...appProps} /></React.Suspense>}`;

    content = content.replace(fullMatch, replacement);
    console.log(`Extracted ${f.name}`);
});

fs.writeFileSync(appFile, content);
console.log("Refactoring complete.");
