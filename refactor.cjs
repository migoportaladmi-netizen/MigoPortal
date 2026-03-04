const fs = require('fs');
const path = require('path');

const appFile = path.join(__dirname, 'App.tsx');
let content = fs.readFileSync(appFile, 'utf8');

const features = [
    { view: 'dashboard', name: 'Dashboard', dir: 'Dashboard' },
    { view: 'expenses', name: 'Expenses', dir: 'Expenses' },
    { view: 'trips', name: 'Trips', dir: 'Trips' },
    { view: 'time-absence', name: 'TimeAndAbsence', dir: 'TimeAndAbsence' },
    { view: 'my-team', name: 'MyTeam', dir: 'MyTeam' },
    { view: 'goals', name: 'Goals', dir: 'Goals' },
    { view: 'jobs', name: 'Jobs', dir: 'Jobs' },
    { view: 'recognition', name: 'Recognition', dir: 'Recognition' },
    { view: 'reviews', name: 'Reviews', dir: 'Reviews' },
    { view: 'surveys', name: 'Surveys', dir: 'Surveys' },
    { view: 'recruitment', name: 'Recruitment', dir: 'Recruitment' },
    { view: 'team', name: 'ManageTeam', dir: 'Admin' },
    { view: 'company-settings', name: 'CompanySettings', dir: 'Admin' },
    { view: 'settings', name: 'Settings', dir: 'Admin' }, // grouping settings
];

function extractBlock(content, viewName) {
    const startStr = `{view === '${viewName}' && (`;
    const startIndex = content.indexOf(startStr);
    if (startIndex === -1) return null;

    let openCount = 0;
    let inStr = false;
    let strChar = '';
    let endIdx = -1;

    for (let i = startIndex + startStr.length - 1; i < content.length; i++) {
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
        const block = content.substring(startIndex + startStr.length, endIdx);
        return {
            block,
            fullMatch: content.substring(startIndex, endIdx + 2), // include )}
        };
    }
    return null;
}

features.forEach(f => {
    const ext = extractBlock(content, f.view);
    if (ext) {
        const componentCode = `import React from 'react';
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

export default function ${f.name}(props: any) {
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
        content = content.replace(ext.fullMatch, `{view === '${f.view}' && <React.Suspense fallback={<div className="p-8 text-center text-slate-500">Loading...</div>}><${f.name} {...appProps} /></React.Suspense>}`);
        console.log(`Extracted ${f.name}`);
    } else {
        console.log(`Could not find block for ${f.view}`);
    }
});

// Write top level imports for App.tsx
const importStrs = features.map(f => `const ${f.name} = React.lazy(() => import('./features/${f.dir}/${f.name}'));`).join('\n');
content = content.replace("import React, { useState, useEffect, useRef } from 'react';", `import React, { useState, useEffect, useRef } from 'react';\n${importStrs}`);

// Inject appProps definition right inside render:
// Find `const myTeam = allUsers.filter`
const propsInjectPoint = `const myTeam = allUsers`;
const appPropsDef = `
  const appProps = {
    user, expenses, trips, setView, jobs, surveys, allUsers, timeEntries, absenceRequests,
    praiseList, reviewTemplates, reviews, goals, applications, myTeam: allUsers.filter(u => u.employment?.managerEmail === user.email), isManager: allUsers.filter(u => u.employment?.managerEmail === user.email).length > 0 || user.role === 'Administrator',
    visibleExpensesCount, setVisibleExpensesCount,
    calculateLeaveBalance, handleGenerateItinerary, isGeneratingItinerary, 
    selectedTripForItinerary, setEditingTripId, setNewTrip, setIsTripModalOpen,
    setActiveTimeAbsenceTab, setIsTimeModalOpen, setIsAbsenceModalOpen,
    timeAbsenceViewMode, setTimeAbsenceViewMode, teamTimeEntries, teamAbsenceRequests,
    setConfirmationModal, handleUpdateGoalStatus, setIsGoalModalOpen,
    setIsSettingModalOpen: () => {}, setActiveSettingsTab, setIsManageTeamModalOpen,
    setIsJobModalOpen, setIsApplicationModalOpen, setSelectedJobForApplication,
    setIsInviteUserModalOpen, isDocumentUploadModalOpen: false, setIsDocumentUploadModalOpen,
    setIsCreateSurveyModalOpen, setIsTakeSurveyModalOpen, setIsSurveyResultsModalOpen,
    setSelectedSurvey, handleUpdateStatus, isReviewModalOpen, handleOpenReviewModal, setIsStartCycleModalOpen,
    setIsTemplateModalOpen, startCycleForm, setStartCycleForm
  };

  const myTeam = allUsers`;

content = content.replace(propsInjectPoint, appPropsDef);

fs.writeFileSync(appFile, content);
console.log("Refactoring complete.");
