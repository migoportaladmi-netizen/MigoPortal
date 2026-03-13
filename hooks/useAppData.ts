import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
    Expense, Trip, UserProfile, TimeEntry, AbsenceRequest, Job, JobApplication, Praise, Survey, SurveyResponse, EmployeeReview, ReviewTemplate, Goal, PayStub, PayrollRun,
    ExpenseCategory, AbsenceType, InterviewSentiment, InterviewFeedback, AppNotification
} from '../types';
import {
    INITIAL_EXPENSES, MOCK_TRIPS, MOCK_USERS, MOCK_TIME_ENTRIES, MOCK_ABSENCE_REQUESTS, MOCK_JOBS, MOCK_APPLICATIONS, MOCK_PRAISE, MOCK_SURVEYS, MOCK_SURVEY_RESPONSES, MOCK_NOTIFICATIONS, MOCK_REVIEWS, MOCK_REVIEW_TEMPLATES, ROLE_BASED_QUESTIONS, MOCK_GOALS, MOCK_PAYROLL_RUNS, MOCK_PAY_STUBS
} from '../constants';

export const useAppData = (user: UserProfile, setUser: React.Dispatch<React.SetStateAction<UserProfile>>) => {
    // Data State
    const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
    const [trips, setTrips] = useState<Trip[]>(MOCK_TRIPS);
    const [allUsers, setAllUsers] = useState<UserProfile[]>(MOCK_USERS);
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
    const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>(MOCK_PAYROLL_RUNS);
    const [payStubs, setPayStubs] = useState<PayStub[]>(MOCK_PAY_STUBS);
    const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);

    // Pagination/Visibility State (Data related)
    const [visibleExpensesCount, setVisibleExpensesCount] = useState(10);
    const [visibleTripsCount, setVisibleTripsCount] = useState(10);
    const [visibleNotificationsCount, setVisibleNotificationsCount] = useState(10);

    const [isGeneratingItinerary, setIsGeneratingItinerary] = useState(false);
    const [selectedTripForItinerary, setSelectedTripForItinerary] = useState<Trip | null>(null);

    // Handlers
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

    const handleReceiptAnalysis = (data: any, imageUrl: string) => {
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

    const handleSaveManualExpense = (newManualExpense: Partial<Expense>, onSuccess: () => void) => {
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
        onSuccess();
    };

    const handleConfirmApply = (selectedJobToApply: Job, applicationNote: string, applicationCv: any, onSuccess: () => void) => {
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
        onSuccess();
        alert("Application submitted successfully!");
    };

    const handleSaveTimeEntry = (newTimeEntry: Partial<TimeEntry>, onSuccess: () => void) => {
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
        onSuccess();
    };

    const handleSaveAbsence = (newAbsence: Partial<AbsenceRequest>, onSuccess: () => void) => {
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
        onSuccess();
    };

    const handleSaveTeamAssignment = (employeeEmail: string, managerEmail: string, onSuccess: () => void) => {
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
        onSuccess();
    };

    const handleRemoveTeamMember = (itemId: string, onSuccess: () => void) => {
        setAllUsers(prev => prev.map(u => {
            if (u.email === itemId) {
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
        onSuccess();
    };

    const handleSendInvite = (inviteForm: any, onSuccess: () => void) => {
        if (!inviteForm.email || !inviteForm.name) return;

        const initials = inviteForm.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

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
                location: 'Remote'
            }
        };

        setAllUsers(prev => [...prev, newUser]);
        onSuccess();
        alert(`Invitation sent to ${inviteForm.email}`);
    };

    const handleSaveProfile = (editedUser: UserProfile, onSuccess: () => void) => {
        setUser(editedUser);
        setAllUsers(prev => prev.map(u => u.email === user.email ? editedUser : u));
        onSuccess();
    };

    const handleSavePraise = (newPraiseData: { toUserEmail: string; message: string; category: Praise['category'] }, onSuccess: () => void) => {
        const recipient = allUsers.find(u => u.email === newPraiseData.toUserEmail);
        if (!recipient) return;

        const praise: Praise = {
            id: uuidv4(),
            fromUserName: user.name,
            fromUserEmail: user.email,
            fromUserInitials: user.avatarInitials,
            toUserName: recipient.name,
            toUserEmail: recipient.email,
            toUserInitials: recipient.avatarInitials,
            message: newPraiseData.message,
            category: newPraiseData.category,
            date: new Date().toISOString().split('T')[0],
            companyId: user.companyId
        };

        setPraiseList(prev => [praise, ...prev]);
        onSuccess();
    };

    const handleSaveJob = (newJob: Partial<Job>, editingJobId: string | null, onSuccess: () => void) => {
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
        onSuccess();
    };

    const handleSaveTrip = (newTrip: Partial<Trip>, editingTripId: string | null, onSuccess: () => void) => {
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
        onSuccess();
    };

    const handleGenerateItinerary = async (trip: Trip) => {
        setSelectedTripForItinerary(trip);
        setIsGeneratingItinerary(true);
        try {
            const result = `# Trip to ${trip.destination}\n\n*Please add your itinerary plans manually.*`;
            if (result) {
                setTrips(prev => prev.map(t => t.id === trip.id ? { ...t, itinerary: result } : t));
            }
        } catch (error) {
            alert("Failed to generate itinerary. Please try again.");
        } finally {
            setIsGeneratingItinerary(false);
        }
    };

    const handleSendPraise = (newPraise: any, onSuccess: () => void) => {
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
        onSuccess();
    };

    const handleScheduleInterview = (selectedApplication: JobApplication, newInterview: any, onSuccess: () => void) => {
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

        onSuccess();
        alert(`Interview scheduled with ${interviewer.name}`);
    };

    const handleSubmitFeedback = (selectedApplication: JobApplication, selectedReviewId: string, feedbackForm: any, onSuccess: () => void) => {
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

        onSuccess();
        alert("Feedback submitted successfully");
    };

    const handleUpdateStatus = (appId: string, status: 'Hired' | 'Rejected') => {
        setApplications(prev => prev.map(app =>
            app.id === appId ? { ...app, status: status } : app
        ));
        alert(`Candidate marked as ${status}`);
    };

    const handleSaveReview = (selectedReview: EmployeeReview, reviewForm: any, reviewResponses: any, onSuccess: () => void) => {
        const isManager = selectedReview.managerEmail === user.email;

        setReviews(prev => prev.map(r => {
            if (r.id === selectedReview.id) {
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

        onSuccess();
    };

    const handleCreateSurvey = (newSurveyData: { title: string; description: string; questions: { id: string; text: string; type: 'rating' | 'text' }[] }, onSuccess: () => void) => {
        if (!newSurveyData.title || newSurveyData.questions.length === 0) return;
        const survey: Survey = {
            id: uuidv4(),
            title: newSurveyData.title,
            description: newSurveyData.description,
            questions: newSurveyData.questions,
            isActive: true,
            createdAt: new Date().toISOString().split('T')[0],
            createdBy: user.name,
            companyId: user.companyId || ''
        };
        setSurveys(prev => [survey, ...prev]);
        onSuccess();
    };

    const handleSaveTemplate = (newTemplate: any, onSuccess: () => void) => {
        if (!newTemplate.name || newTemplate.questions.length === 0) return;
        const template: ReviewTemplate = {
            id: uuidv4(),
            name: newTemplate.name,
            role: newTemplate.role,
            questions: newTemplate.questions,
            companyId: user.companyId || ''
        };
        setReviewTemplates(prev => [...prev, template]);
        onSuccess();
    };

    const handleStartReviewCycle = (startCycleForm: any, onSuccess: () => void) => {
        if (!startCycleForm.period || !startCycleForm.templateId) return;
        const template = reviewTemplates.find(t => t.id === startCycleForm.templateId);
        if (!template) return;

        const eligibleUsers = allUsers.filter(u => u.role !== 'Administrator');

        const newReviews: EmployeeReview[] = eligibleUsers.map(emp => {
            const manager = allUsers.find(u => u.email === emp.employment?.managerEmail) || allUsers.find(u => u.role === 'Administrator')!;
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
        onSuccess();
    };

    const handleSaveGoal = (newGoal: Partial<Goal>, onSuccess: () => void) => {
        const goal: Goal = {
            id: uuidv4(),
            userId: user.email,
            userName: user.name,
            companyId: user.companyId || '',
            ...newGoal as Goal
        };
        setGoals(prev => [goal, ...prev]);
        onSuccess();
    };

    const handleUpdateGoalStatus = (goalId: string, status: Goal['status']) => {
        setGoals(prev => prev.map(g => g.id === goalId ? { ...g, status } : g));
    };

    const handleDeleteGoal = (goalId: string) => {
        setGoals(prev => prev.filter(g => g.id !== goalId));
    };

    return {
        expenses, setExpenses,
        trips, setTrips,
        allUsers, setAllUsers,
        timeEntries, setTimeEntries,
        absenceRequests, setAbsenceRequests,
        jobs, setJobs,
        applications, setApplications,
        praiseList, setPraiseList,
        surveys, setSurveys,
        surveyResponses, setSurveyResponses,
        reviews, setReviews,
        reviewTemplates, setReviewTemplates,
        goals, setGoals,
        payrollRuns, setPayrollRuns,
        payStubs, setPayStubs,
        notifications, setNotifications,
        visibleExpensesCount, setVisibleExpensesCount,
        visibleTripsCount, setVisibleTripsCount,
        visibleNotificationsCount, setVisibleNotificationsCount,
        isGeneratingItinerary, setIsGeneratingItinerary,
        selectedTripForItinerary, setSelectedTripForItinerary,
        calculateLeaveBalance,
        handleReceiptAnalysis,
        handleSaveManualExpense,
        handleConfirmApply,
        handleSavePraise,
        handleSaveTimeEntry,
        handleSaveAbsence,
        handleSaveTeamAssignment,
        handleRemoveTeamMember,
        handleSendInvite,
        handleSaveProfile,
        handleSaveJob,
        handleSaveTrip,
        handleGenerateItinerary,
        handleSendPraise,
        handleScheduleInterview,
        handleSubmitFeedback,
        handleUpdateStatus,
        handleSaveReview,
        handleSaveTemplate,
        handleStartReviewCycle,
        handleCreateSurvey,
        handleSaveGoal,
        handleUpdateGoalStatus,
        handleDeleteGoal
    };
};
