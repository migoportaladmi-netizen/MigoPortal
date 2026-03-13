import { useState } from 'react';
import { Expense, ExpenseCategory, Trip, Job, JobApplication, AbsenceRequest, TimeEntry, Survey, EmployeeReview, UserProfile, Budget, InterviewSentiment, AbsenceType, Praise, Goal } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const useAppModals = () => {
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
    const [editingTripId, setEditingTripId] = useState<string | null>(null);
    const [newTrip, setNewTrip] = useState<Partial<Trip>>({
        destination: '', purpose: '', startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0], budget: 0, status: 'Planned'
    });
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    // Time & Absence States
    const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
    const [isAbsenceModalOpen, setIsAbsenceModalOpen] = useState(false);
    const [activeTimeAbsenceTab, setActiveTimeAbsenceTab] = useState<'my-time' | 'team-requests'>('my-time');
    const [timeAbsenceViewMode, setTimeAbsenceViewMode] = useState<'calendar' | 'list'>('calendar');
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

    // Recruitment States
    const [isAssignInterviewerModalOpen, setIsAssignInterviewerModalOpen] = useState(false);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
    const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
    const [activeRecruitmentTab, setActiveRecruitmentTab] = useState<'pipeline' | 'interviews' | 'analytics'>('pipeline');
    const [newInterview, setNewInterview] = useState({ interviewerEmail: '', date: '', time: '', notes: '' });
    const [feedbackForm, setFeedbackForm] = useState({ notes: '', sentiment: 'Neutral' as InterviewSentiment });
    const [decisionForm, setDecisionForm] = useState({ notes: '' });

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

    // Employee Review State
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState<EmployeeReview | null>(null);
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    const [isStartCycleModalOpen, setIsStartCycleModalOpen] = useState(false);
    const [activeReviewTab, setActiveReviewTab] = useState<'my-reviews' | 'team-reviews' | 'templates'>('my-reviews');
    const [startCycleForm, setStartCycleForm] = useState({ period: '', templateId: '' });
    const [reviewForm, setReviewForm] = useState({ text: '', rating: 5 });
    const [reviewResponses, setReviewResponses] = useState<Record<string, string>>({});
    const [newTemplate, setNewTemplate] = useState<{ name: string; role: string; questions: string[] }>({ name: '', role: '', questions: [''] });

    // Goal State
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
    const [newGoal, setNewGoal] = useState<Partial<Goal>>({ title: '', description: '', type: 'Business', visibility: 'Manager', status: 'Not Started', dueDate: '' });

    // Team Management State
    const [isManageTeamModalOpen, setIsManageTeamModalOpen] = useState(false);
    const [selectedTeamMember, setSelectedTeamMember] = useState<UserProfile | null>(null);
    const [isInviteUserModalOpen, setIsInviteUserModalOpen] = useState(false);
    const [isTeamMemberProfileModalOpen, setIsTeamMemberProfileModalOpen] = useState(false);
    const [selectedTeamMemberProfile, setSelectedTeamMemberProfile] = useState<UserProfile | null>(null);
    const [activeSettingsTab, setActiveSettingsTab] = useState<'profile' | 'notifications' | 'security'>('profile');
    const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: 'Employee', jobTitle: '', department: '' });
    const [resetPasswordForm, setResetPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);

    // Documents Upload State
    const [isDocumentUploadModalOpen, setIsDocumentUploadModalOpen] = useState(false);

    // Confirmation Modal State
    const [confirmationModal, setConfirmationModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        action: 'approve' | 'reject' | 'approve-absence' | 'reject-absence' | 'delete-job' | 'delete-survey' | 'remove-team-member' | 'hire-candidate' | 'reject-candidate' | 'logout' | 'approve-time' | 'reject-time' | 'delete-time-entry' | 'delete-absence-request' | 'delete-goal';
        itemId: string | null;
        isDestructive?: boolean;
    }>({ isOpen: false, title: '', message: '', action: 'approve', itemId: null });

    return {
        isExpenseModalOpen, setIsExpenseModalOpen,
        expenseEntryMode, setExpenseEntryMode,
        newManualExpense, setNewManualExpense,
        isTripModalOpen, setIsTripModalOpen,
        isItineraryModalOpen, setIsItineraryModalOpen,
        isBudgetModalOpen, setIsBudgetModalOpen,
        newTrip, setNewTrip,
        editingTripId, setEditingTripId,
        isLogoutModalOpen, setIsLogoutModalOpen,
        isDetailModalOpen, setIsDetailModalOpen,
        isTimeModalOpen, setIsTimeModalOpen,
        isAbsenceModalOpen, setIsAbsenceModalOpen,
        activeTimeAbsenceTab, setActiveTimeAbsenceTab,
        timeAbsenceViewMode, setTimeAbsenceViewMode,
        newTimeEntry, setNewTimeEntry,
        newAbsence, setNewAbsence,
        // ...
        isJobModalOpen, setIsJobModalOpen,
        isApplicationModalOpen, setIsApplicationModalOpen,
        selectedJobForApplication, setSelectedJobForApplication,
        newJob, setNewJob,
        editingJobId, setEditingJobId,
        isApplyModalOpen, setIsApplyModalOpen,
        selectedJobToApply, setSelectedJobToApply,
        selectedReviewId, setSelectedReviewId,
        activeRecruitmentTab, setActiveRecruitmentTab,
        newInterview, setNewInterview,
        feedbackForm, setFeedbackForm,
        decisionForm, setDecisionForm,
        isFeedbackModalOpen, setIsFeedbackModalOpen,
        isDecisionModalOpen, setIsDecisionModalOpen,
        selectedApplication, setSelectedApplication,
        isPraiseModalOpen, setIsPraiseModalOpen,
        newPraise, setNewPraise,
        // ...
        isCreateSurveyModalOpen, setIsCreateSurveyModalOpen,
        isTakeSurveyModalOpen, setIsTakeSurveyModalOpen,
        isSurveyResultsModalOpen, setIsSurveyResultsModalOpen,
        selectedSurvey, setSelectedSurvey,
        newSurvey, setNewSurvey,
        isReviewModalOpen, setIsReviewModalOpen,
        selectedReview, setSelectedReview,
        isTemplateModalOpen, setIsTemplateModalOpen,
        isStartCycleModalOpen, setIsStartCycleModalOpen,
        activeReviewTab, setActiveReviewTab,
        startCycleForm, setStartCycleForm,
        reviewForm, setReviewForm,
        reviewResponses, setReviewResponses,
        newTemplate, setNewTemplate,
        isGoalModalOpen, setIsGoalModalOpen,
        newGoal, setNewGoal,
        isManageTeamModalOpen, setIsManageTeamModalOpen,
        selectedTeamMember, setSelectedTeamMember,
        isInviteUserModalOpen, setIsInviteUserModalOpen,
        isTeamMemberProfileModalOpen, setIsTeamMemberProfileModalOpen,
        selectedTeamMemberProfile, setSelectedTeamMemberProfile,
        activeSettingsTab, setActiveSettingsTab,
        inviteForm, setInviteForm,
        resetPasswordForm, setResetPasswordForm,
        isResetPasswordModalOpen, setIsResetPasswordModalOpen,
        isDocumentUploadModalOpen, setIsDocumentUploadModalOpen,
        confirmationModal, setConfirmationModal
    };
};
