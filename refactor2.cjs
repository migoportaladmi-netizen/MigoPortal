const fs = require('fs');
const path = require('path');

const appFile = path.join(__dirname, 'App.tsx');
// Reset App.tsx to original state for clean re-extraction if needed. Actually we'll just fix the missing ones in the already modified App.tsx. It's safer to just reset it from git, but git isn't guaranteed. 
// wait, the previous run replaced some blocks. I'll just check if they are still there before extracting.
let content = fs.readFileSync(appFile, 'utf8');

// Fix Settings collision
content = content.replace("const Settings = React.lazy(() => import('./features/Admin/Settings'));", "const SettingsView = React.lazy(() => import('./features/Admin/Settings'));");
content = content.replace("<Settings {...appProps} />", "<SettingsView {...appProps} />");

const features = [
    { view: 'my-team', name: 'MyTeam', dir: 'MyTeam', matchStr: "{view === 'my-team' && (" },
    { view: 'team', name: 'ManageTeam', dir: 'Admin', matchStr: "{view === 'team' && user.role === 'Administrator' && (" },
    { view: 'company-settings', name: 'CompanySettings', dir: 'Admin', matchStr: "{view === 'company-settings' && user.role === 'Administrator' && (" }
];

function extractBlock(content, matchStr) {
    const startIndex = content.indexOf(matchStr);
    if (startIndex === -1) return null;

    let openCount = 0;
    let inStr = false;
    let strChar = '';
    let endIdx = -1;

    for (let i = startIndex + matchStr.length - 1; i < content.length; i++) {
        const char = content[i];
        if (!inStr) {
            if (char === "'" || char === '"' || char === '`') {
                inStr = true;
                strChar = char;
            } else if (char === '(') {
                openCount++;
            } else if (char === ')') {
                openCount--;
                if (openCount === 0) {
                    endIdx = i;
                    break;
                }
            }
        } else {
            if (char === '\\') i++; // skip escaped
            else if (char === strChar) inStr = false;
        }
    }

    if (endIdx !== -1) {
        const block = content.substring(startIndex + matchStr.length, endIdx);
        return {
            block,
            fullMatch: content.substring(startIndex, endIdx + 2), // include )}
        };
    }
    return null;
}

features.forEach(f => {
    const ext = extractBlock(content, f.matchStr);
    if (ext) {
        const componentCode = `import React from 'react';
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
    handleOpenAssignManager, isInviteUserModalOpen, inviteForm, setInviteForm, handleSendInvite, seatCount
  } = props;

  return (
    ${ext.block}
  );
}
`;
        const dirPath = path.join(__dirname, 'features', f.dir);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        fs.writeFileSync(path.join(dirPath, `${f.name}.tsx`), componentCode);

        // Replace in App.tsx
        content = content.replace(ext.fullMatch, `${f.matchStr.slice(0, -2)}<React.Suspense fallback={<div className="p-8 text-center text-slate-500">Loading...</div>}><${f.name} {...appProps} /></React.Suspense>}`);
        console.log(`Extracted ${f.name}`);
    } else {
        console.log(`Could not find block for ${f.name}`);
    }
});

// Write top level imports for App.tsx
const importStrs = features.map(f => `const ${f.name} = React.lazy(() => import('./features/${f.dir}/${f.name}'));`).join('\n');
content = content.replace("const myTeam = allUsers", `${importStrs}\n\n  const myTeam = allUsers`);

fs.writeFileSync(appFile, content);
console.log("Refactoring complete.");

// ALSO update Settings.tsx itself to export SettingsView
const settingsFile = path.join(__dirname, 'features/Admin/Settings.tsx');
if (fs.existsSync(settingsFile)) {
    let sfContent = fs.readFileSync(settingsFile, 'utf8');
    sfContent = sfContent.replace('export default function Settings(', 'export default function SettingsView(');
    fs.writeFileSync(settingsFile, sfContent);
}

