import { Expense, ExpenseCategory, Trip, UserProfile, TimeEntry, AbsenceRequest, AbsenceType, Job, JobApplication, Praise, Survey, SurveyResponse, Company, AppNotification, EmployeeReview, ReviewTemplate, Goal, PayStub, PayrollRun } from './types';

export const MOCK_COMPANY: Company = {
  id: 'comp_123',
  name: 'TechCorp LLC',
  domain: 'migoportal.com',
  subscriptionPlan: 'Team Starter',
  subscriptionStatus: 'Active',
  address: '123 Innovation Blvd, Tech City, CA 94000',
  taxId: 'US-99-887766',
  inviteCode: 'TECH-2024'
};

export const MOCK_USERS: UserProfile[] = [
  {
    name: 'Alice Admin',
    email: 'admin@migoportal.com',
    role: 'Administrator',
    phone: '555-0100',
    avatarInitials: 'AA',
    companyId: 'comp_123',
    budget: {
      amount: 50000,
      period: 'Yearly',
      lastUpdated: '2023-01-01'
    },
    employment: {
      jobTitle: 'VP of Operations',
      department: 'Operations',
      startDate: '2020-06-15',
      employmentType: 'Full-time',
      location: 'New York, NY'
    },
    compensation: {
      baseSalary: 145000,
      currency: 'USD',
      effectiveDate: '2023-01-01',
      bonuses: [
        { date: '2023-12-15', amount: 15000, reason: 'Annual Performance' }
      ]
    },
    emergencyContact: {
      name: 'John Admin',
      relationship: 'Spouse',
      phone: '555-9999'
    },
    documents: [
      { id: 'd1', name: 'Employment Contract.pdf', type: 'PDF', category: 'Contract', uploadDate: '2020-06-10' },
      { id: 'd2', name: 'W4 Form 2023.pdf', type: 'PDF', category: 'Tax', uploadDate: '2023-01-05' }
    ]
  },
  {
    name: 'Bob Employee',
    email: 'bob@migoportal.com',
    role: 'User',
    phone: '555-0101',
    avatarInitials: 'BE',
    companyId: 'comp_123',
    budget: {
      amount: 2000,
      period: 'Monthly',
      lastUpdated: '2023-10-01'
    },
    employment: {
      jobTitle: 'Senior Frontend Engineer',
      department: 'Engineering',
      startDate: '2022-03-01',
      managerName: 'Alice Admin',
      managerEmail: 'admin@migoportal.com',
      employmentType: 'Full-time',
      location: 'Remote'
    },
    compensation: {
      baseSalary: 125000,
      currency: 'USD',
      effectiveDate: '2023-03-01',
      bonuses: [
        { date: '2023-06-30', amount: 5000, reason: 'Project Completion' }
      ]
    },
    emergencyContact: {
      name: 'Sarah Employee',
      relationship: 'Sibling',
      phone: '555-8888'
    },
    documents: [
      { id: 'd3', name: 'Offer Letter.pdf', type: 'PDF', category: 'Contract', uploadDate: '2022-02-20' },
      { id: 'd4', name: 'Direct Deposit Form.pdf', type: 'PDF', category: 'Other', uploadDate: '2022-03-01' },
      { id: 'd5', name: 'Passport Copy.jpg', type: 'Image', category: 'ID', uploadDate: '2022-03-01' }
    ]
  },
  {
    name: 'Charlie Designer',
    email: 'charlie@migoportal.com',
    role: 'User',
    phone: '555-0102',
    avatarInitials: 'CD',
    companyId: 'comp_123',
    budget: {
      amount: 1500,
      period: 'Monthly',
      lastUpdated: '2023-10-01'
    },
    employment: {
      jobTitle: 'Product Designer',
      department: 'Product',
      startDate: '2023-01-15',
      managerName: 'Alice Admin',
      managerEmail: 'admin@migoportal.com',
      employmentType: 'Full-time',
      location: 'Austin, TX'
    },
    compensation: {
      baseSalary: 115000,
      currency: 'USD',
      effectiveDate: '2023-01-15'
    },
    documents: []
  }
];

export const ROLE_BASED_QUESTIONS: Record<string, string[]> = {
  'Software Engineer': [
    'How would you rate the technical quality of your code this quarter?',
    'Describe a complex technical challenge you overcame.',
    'How have you contributed to the team\'s architectural decisions?',
    'What new technologies or skills have you learned?'
  ],
  'Product Manager': [
    'How successful were your product launches this quarter?',
    'Describe how you prioritized features based on user feedback.',
    'How effectively did you collaborate with engineering and design?',
    'What key metrics did you impact?'
  ],
  'Sales Representative': [
    'Did you meet or exceed your sales quota? Breakdown the numbers.',
    'Describe your biggest deal closed and how you managed it.',
    'How healthy is your pipeline for the next quarter?',
    'What challenges did you face in closing deals?'
  ],
  'Leadership/Management': [
    'How have you supported your team\'s career growth?',
    'Describe a difficult decision you made and the outcome.',
    'How are you fostering a positive team culture?',
    'Are you on track with the department\'s strategic goals?'
  ],
  'General': [
    'What were your top 3 achievements this period?',
    'What is one area you want to improve in?',
    'How well did you collaborate with your peers?',
    'Do you have the tools and resources you need to succeed?'
  ]
};

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: '1',
    merchant: 'Uber Technologies',
    amount: 45.50,
    currency: 'USD',
    date: '2023-10-15',
    category: ExpenseCategory.TRAVEL,
    description: 'Ride to SFO Airport',
    status: 'Approved',
    taxDeductibility: 'Yes',
    submittedBy: 'Bob Employee',
    companyId: 'comp_123'
  },
  {
    id: '2',
    merchant: 'United Airlines',
    amount: 450.00,
    currency: 'USD',
    date: '2023-10-15',
    category: ExpenseCategory.TRAVEL,
    description: 'Flight to NYC for TechConf',
    status: 'Approved',
    taxDeductibility: 'Yes',
    submittedBy: 'Bob Employee',
    companyId: 'comp_123'
  },
  {
    id: '3',
    merchant: 'Starbucks',
    amount: 12.75,
    currency: 'USD',
    date: '2023-10-16',
    category: ExpenseCategory.MEALS,
    description: 'Coffee meeting with client',
    status: 'Pending',
    taxDeductibility: 'Partial',
    taxReasoning: 'Business meal - 50% limit',
    submittedBy: 'Bob Employee',
    companyId: 'comp_123'
  },
  {
    id: '4',
    merchant: 'Marriott Marquis',
    amount: 850.00,
    currency: 'USD',
    date: '2023-10-18',
    category: ExpenseCategory.LODGING,
    description: '3 nights stay',
    status: 'Pending',
    taxDeductibility: 'Yes',
    submittedBy: 'Bob Employee',
    companyId: 'comp_123'
  },
  {
    id: '5',
    merchant: 'Apple Store',
    amount: 2400.00,
    currency: 'USD',
    date: '2023-10-20',
    category: ExpenseCategory.OFFICE_SUPPLIES,
    description: 'MacBook Pro for new dev',
    status: 'Rejected',
    taxDeductibility: 'Yes',
    submittedBy: 'Bob Employee',
    companyId: 'comp_123'
  },
  {
    id: '6',
    merchant: 'Delta Airlines',
    amount: 320.50,
    currency: 'USD',
    date: '2023-11-01',
    category: ExpenseCategory.TRAVEL,
    description: 'Flight to London',
    status: 'Approved',
    taxDeductibility: 'Yes',
    submittedBy: 'Alice Admin',
    companyId: 'comp_123'
  },
  {
    id: '7',
    merchant: 'Hilton Garden Inn',
    amount: 410.00,
    currency: 'USD',
    date: '2023-11-04',
    category: ExpenseCategory.LODGING,
    description: 'London stay',
    status: 'Approved',
    taxDeductibility: 'Yes',
    submittedBy: 'Alice Admin',
    companyId: 'comp_123'
  },
  {
    id: '8',
    merchant: 'WeWork',
    amount: 75.00,
    currency: 'USD',
    date: '2023-11-03',
    category: ExpenseCategory.OFFICE_SUPPLIES,
    description: 'Day pass for remote work',
    status: 'Approved',
    taxDeductibility: 'Yes',
    submittedBy: 'Alice Admin',
    companyId: 'comp_123'
  },
  {
    id: '9',
    merchant: 'Pret A Manger',
    amount: 18.20,
    currency: 'USD',
    date: '2023-11-03',
    category: ExpenseCategory.MEALS,
    description: 'Quick lunch',
    status: 'Pending',
    taxDeductibility: 'Partial',
    submittedBy: 'Alice Admin',
    companyId: 'comp_123'
  },
  {
    id: '10',
    merchant: 'Salesforce',
    amount: 150.00,
    currency: 'USD',
    date: '2023-11-10',
    category: ExpenseCategory.SOFTWARE,
    description: 'Monthly subscription',
    status: 'Approved',
    taxDeductibility: 'Yes',
    submittedBy: 'Alice Admin',
    companyId: 'comp_123'
  },
  {
    id: '11',
    merchant: 'Lyft',
    amount: 22.40,
    currency: 'USD',
    date: '2023-11-12',
    category: ExpenseCategory.TRAVEL,
    description: 'Ride to client office',
    status: 'Pending',
    taxDeductibility: 'Yes',
    submittedBy: 'Bob Employee',
    companyId: 'comp_123'
  },
  {
    id: '12',
    merchant: 'Amazon AWS',
    amount: 43.12,
    currency: 'USD',
    date: '2023-11-15',
    category: ExpenseCategory.SOFTWARE,
    description: 'Cloud hosting fees',
    status: 'Approved',
    taxDeductibility: 'Yes',
    submittedBy: 'Bob Employee',
    companyId: 'comp_123'
  }
];

export const MOCK_TRIPS: Trip[] = [
  {
    id: 't1',
    destination: 'New York, NY',
    startDate: '2023-10-15',
    endDate: '2023-10-18',
    purpose: 'TechConf 2023',
    status: 'Completed',
    budget: 2000,
    spent: 1358.25,
    itinerary: '## NYC Trip Itinerary\n\n**Day 1**\n- Arrive at JFK\n- Check-in at Marriott\n\n**Day 2**\n- Conference Keynote\n- Networking Lunch',
    companyId: 'comp_123'
  },
  {
    id: 't2',
    destination: 'London, UK',
    startDate: '2023-11-02',
    endDate: '2023-11-05',
    purpose: 'Client Merger Meeting',
    status: 'Planned',
    budget: 3500,
    spent: 748.70,
    companyId: 'comp_123'
  },
  {
    id: 't3',
    destination: 'Austin, TX',
    startDate: '2023-12-10',
    endDate: '2023-12-12',
    purpose: 'SXSW Planning',
    status: 'Planned',
    budget: 1500,
    spent: 0,
    companyId: 'comp_123'
  },
  {
    id: 't4',
    destination: 'San Francisco, CA',
    startDate: '2024-01-15',
    endDate: '2024-01-20',
    purpose: 'Quarterly Review',
    status: 'Planned',
    budget: 2800,
    spent: 0,
    companyId: 'comp_123'
  },
  {
    id: 't5',
    destination: 'Berlin, Germany',
    startDate: '2024-02-05',
    endDate: '2024-02-10',
    purpose: 'European Expansion',
    status: 'Planned',
    budget: 4000,
    spent: 0,
    companyId: 'comp_123'
  }
];

export const MOCK_TIME_ENTRIES: TimeEntry[] = [
  {
    id: 'tm1',
    date: '2023-11-20',
    startTime: '09:00',
    endTime: '17:00',
    description: 'Frontend Development',
    totalHours: 8,
    userId: 'bob@migoportal.com',
    userName: 'Bob Employee',
    companyId: 'comp_123',
    status: 'Approved'
  },
  {
    id: 'tm2',
    date: '2023-11-21',
    startTime: '09:00',
    endTime: '12:00',
    description: 'Client Meetings',
    totalHours: 3,
    userId: 'bob@migoportal.com',
    userName: 'Bob Employee',
    companyId: 'comp_123',
    status: 'Pending'
  },
  {
    id: 'tm3',
    date: '2023-11-21',
    startTime: '13:00',
    endTime: '18:00',
    description: 'Documentation',
    totalHours: 5,
    userId: 'bob@migoportal.com',
    userName: 'Bob Employee',
    companyId: 'comp_123',
    status: 'Pending'
  },
  {
    id: 'tm4',
    date: '2023-11-20',
    startTime: '10:00',
    endTime: '16:00',
    description: 'Management Review',
    totalHours: 6,
    userId: 'admin@migoportal.com',
    userName: 'Alice Admin',
    companyId: 'comp_123',
    status: 'Approved'
  }
];

export const MOCK_ABSENCE_REQUESTS: AbsenceRequest[] = [
  {
    id: 'abs1',
    startDate: '2023-12-24',
    endDate: '2023-12-31',
    type: AbsenceType.VACATION,
    reason: 'Christmas Holiday',
    status: 'Approved',
    userId: 'bob@migoportal.com',
    userName: 'Bob Employee',
    companyId: 'comp_123'
  },
  {
    id: 'abs2',
    startDate: '2023-11-30',
    endDate: '2023-11-30',
    type: AbsenceType.SICK,
    reason: 'Doctor Appointment',
    status: 'Pending',
    userId: 'bob@migoportal.com',
    userName: 'Bob Employee',
    companyId: 'comp_123'
  },
  {
    id: 'abs3',
    startDate: '2023-11-28',
    endDate: '2023-11-29',
    type: AbsenceType.PERSONAL,
    reason: 'Family event',
    status: 'Approved',
    userId: 'admin@migoportal.com',
    userName: 'Alice Admin',
    companyId: 'comp_123'
  }
];

export const MOCK_JOBS: Job[] = [
  {
    id: 'job1',
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    salaryRange: '$120k - $160k',
    description: 'We are looking for an experienced React developer to lead our frontend team.',
    postedDate: '2023-11-15',
    status: 'Open',
    companyId: 'comp_123'
  },
  {
    id: 'job2',
    title: 'Product Manager',
    department: 'Product',
    location: 'New York, NY',
    type: 'Full-time',
    salaryRange: '$110k - $150k',
    description: 'Drive the product vision and strategy for our core travel expense platform.',
    postedDate: '2023-11-10',
    status: 'Open',
    companyId: 'comp_123'
  },
  {
    id: 'job3',
    title: 'Marketing Intern',
    department: 'Marketing',
    location: 'Austin, TX',
    type: 'Part-time',
    salaryRange: '$25/hr',
    description: 'Assist with social media campaigns and content creation.',
    postedDate: '2023-11-18',
    status: 'Closed',
    companyId: 'comp_123'
  }
];

// A minimal valid PDF base64 (blank page) for demonstration purposes
const SAMPLE_PDF_BASE64 = "data:application/pdf;base64,JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwogIC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXwKICAvTWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0KPj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSC4gIC9SZXNvdXJjZXMgPDwKICAgIC9Gb250IDw8CiAgICAgIC9FMSA0IDAgUgogICAgPj4KICA+PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9udAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvSGVsdmV0aWNhCj4+CmVuZG9iagoKNSAwIG9iago8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCjcwIDUwIFRECi9FMSAxMiBUZgooSGVsbG8gV29ybGQhKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCgp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTAgMDAwMDAgbiAKMDAwMDAwMDA2MCAwMDAwMCBuIAowMDAwMDAwMTU3IDAwMDAwIG4gCjAwMDAwMDAyNTUgMDAwMDAgbiAKMDAwMDAwMDMzOCAwMDAwMCBuIAp0cmFpbGVyCjw8CiAgL1NpemUgNgogIC9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgo0MTMKJSVFT0YK";

export const MOCK_APPLICATIONS: JobApplication[] = [
  {
    id: 'app1',
    jobId: 'job1',
    applicantName: 'Bob Employee',
    applicantEmail: 'bob@migoportal.com',
    appliedDate: '2023-11-16',
    status: 'Interview',
    companyId: 'comp_123',
    cvName: 'Bob_Resume.pdf',
    cvUrl: SAMPLE_PDF_BASE64,
    reviews: [
      {
        id: 'rev1',
        interviewerEmail: 'admin@migoportal.com',
        interviewerName: 'Alice Admin',
        assignedDate: '2023-11-20',
        status: 'Pending'
      }
    ]
  },
  {
    id: 'app2',
    jobId: 'job2',
    applicantName: 'John Candidate',
    applicantEmail: 'john@example.com',
    appliedDate: '2023-11-12',
    status: 'Pending',
    companyId: 'comp_123',
    cvName: 'John_CV.pdf',
    cvUrl: SAMPLE_PDF_BASE64,
    reviews: []
  },
  {
    id: 'app3',
    jobId: 'job2',
    applicantName: 'Sarah Smith',
    applicantEmail: 'sarah@example.com',
    appliedDate: '2023-11-11',
    status: 'Hired',
    companyId: 'comp_123',
    cvName: 'Sarah_Portfolio.pdf',
    cvUrl: SAMPLE_PDF_BASE64,
    reviews: []
  },
  {
    id: 'app4',
    jobId: 'job1',
    applicantName: 'Mike Developer',
    applicantEmail: 'mike@example.com',
    appliedDate: '2023-11-18',
    status: 'Rejected',
    companyId: 'comp_123',
    cvName: 'Mike_Dev_CV.pdf',
    cvUrl: SAMPLE_PDF_BASE64,
    reviews: []
  }
];

export const MOCK_PRAISE: Praise[] = [
  {
    id: 'p1',
    fromUserName: 'Alice Admin',
    fromUserEmail: 'admin@migoportal.com',
    fromUserInitials: 'AA',
    toUserName: 'Bob Employee',
    toUserEmail: 'bob@migoportal.com',
    toUserInitials: 'BE',
    message: 'Fantastic work on the Q4 sales presentation. Your insights were invaluable!',
    date: '2023-11-20',
    category: 'Leadership',
    companyId: 'comp_123'
  },
  {
    id: 'p2',
    fromUserName: 'Bob Employee',
    fromUserEmail: 'bob@migoportal.com',
    fromUserInitials: 'BE',
    toUserName: 'Charlie Designer',
    toUserEmail: 'charlie@migoportal.com',
    toUserInitials: 'CD',
    message: 'Thanks for helping me debug that tricky UI issue. You are a lifesaver!',
    date: '2023-11-21',
    category: 'Teamwork',
    companyId: 'comp_123'
  },
  {
    id: 'p3',
    fromUserName: 'Charlie Designer',
    fromUserEmail: 'charlie@migoportal.com',
    fromUserInitials: 'CD',
    toUserName: 'Alice Admin',
    toUserEmail: 'admin@migoportal.com',
    toUserInitials: 'AA',
    message: 'Great job organizing the team retreat. It was a huge success.',
    date: '2023-11-22',
    category: 'Dedication',
    companyId: 'comp_123'
  }
];

export const MOCK_SURVEYS: Survey[] = [
  {
    id: 's1',
    title: 'Q4 Employee Satisfaction',
    description: 'Please provide feedback on your work-life balance and team dynamics for this quarter.',
    isActive: true,
    createdAt: '2023-11-01',
    createdBy: 'Alice Admin',
    questions: [
      { id: 'q1', text: 'How satisfied are you with your current role?', type: 'rating' },
      { id: 'q2', text: 'How would you rate the communication within your team?', type: 'rating' },
      { id: 'q3', text: 'What can we improve in the next quarter?', type: 'text' }
    ],
    companyId: 'comp_123'
  },
  {
    id: 's2',
    title: 'Office Relocation Feedback',
    description: 'We are considering moving offices. Let us know your thoughts.',
    isActive: false,
    createdAt: '2023-09-01',
    createdBy: 'Alice Admin',
    questions: [
      { id: 'q1', text: 'How do you feel about the current location?', type: 'rating' },
      { id: 'q2', text: 'Any specific areas you would prefer?', type: 'text' }
    ],
    companyId: 'comp_123'
  }
];

export const MOCK_SURVEY_RESPONSES: SurveyResponse[] = [
  {
    id: 'r1',
    surveyId: 's1',
    userEmail: 'bob@migoportal.com',
    submittedAt: '2023-11-15',
    answers: [
      { questionId: 'q1', value: 4 },
      { questionId: 'q2', value: 5 },
      { questionId: 'q3', value: 'More social events would be nice.' }
    ],
    companyId: 'comp_123'
  },
  {
    id: 'r2',
    surveyId: 's1',
    userEmail: 'charlie@migoportal.com',
    submittedAt: '2023-11-16',
    answers: [
      { questionId: 'q1', value: 5 },
      { questionId: 'q2', value: 3 },
      { questionId: 'q3', value: 'Documentation needs update.' }
    ],
    companyId: 'comp_123'
  }
];

export const MOCK_NOTIFICATIONS: AppNotification[] = Array.from({ length: 45 }, (_, i) => ({
  id: `notif-${i}`,
  title: i % 4 === 0 ? 'Expense Approved' : i % 4 === 1 ? 'New Survey Available' : i % 4 === 2 ? 'Meeting Reminder' : 'System Update',
  message: i % 4 === 0
    ? `Your expense report #${1000 + i} has been approved by finance.`
    : i % 4 === 1
      ? 'A new quarterly engagement survey is available for you to complete.'
      : i % 4 === 2
        ? 'Don\'t forget your team sync scheduled for tomorrow at 10:00 AM.'
        : 'System maintenance is scheduled for this weekend.',
  date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
  type: i % 4 === 0 ? 'success' : i % 4 === 1 ? 'info' : i % 4 === 2 ? 'warning' : 'alert',
  isRead: i > 5
}));

export const MOCK_REVIEW_TEMPLATES: ReviewTemplate[] = [
  {
    id: 'temp1',
    name: 'Standard Engineering Review',
    role: 'Software Engineer',
    questions: ROLE_BASED_QUESTIONS['Software Engineer'],
    companyId: 'comp_123'
  },
  {
    id: 'temp2',
    name: 'General Quarterly Check-in',
    role: 'General',
    questions: ROLE_BASED_QUESTIONS['General'],
    companyId: 'comp_123'
  }
];

export const MOCK_REVIEWS: EmployeeReview[] = [
  {
    id: 'rev1',
    period: '2023 Annual Review',
    employeeName: 'Bob Employee',
    employeeEmail: 'bob@migoportal.com',
    managerName: 'Alice Admin',
    managerEmail: 'admin@migoportal.com',
    status: 'Pending Self',
    templateId: 'temp1',
    responses: ROLE_BASED_QUESTIONS['Software Engineer'].map(q => ({ question: q })),
    companyId: 'comp_123'
  },
  {
    id: 'rev2',
    period: '2023 Mid-Year Review',
    employeeName: 'Bob Employee',
    employeeEmail: 'bob@migoportal.com',
    managerName: 'Alice Admin',
    managerEmail: 'admin@migoportal.com',
    status: 'Completed',
    selfReview: 'I delivered the new frontend architecture ahead of schedule.',
    selfRating: 5,
    submittedAt: '2023-07-15',
    managerReview: 'Excellent work this half. Bob continues to exceed expectations.',
    managerRating: 5,
    completedAt: '2023-07-20',
    companyId: 'comp_123'
  },
  {
    id: 'rev3',
    period: '2023 Annual Review',
    employeeName: 'Charlie Designer',
    employeeEmail: 'charlie@migoportal.com',
    managerName: 'Alice Admin',
    managerEmail: 'admin@migoportal.com',
    status: 'Pending Manager',
    selfReview: 'Improved the design system and shipped 3 major features.',
    selfRating: 4,
    submittedAt: '2023-12-01',
    companyId: 'comp_123'
  }
];

export const MOCK_GOALS: Goal[] = [
  {
    id: 'g1',
    title: 'Increase Q4 Revenue by 15%',
    description: 'Focus on enterprise clients and upselling existing accounts.',
    type: 'Business',
    visibility: 'Public',
    status: 'In Progress',
    dueDate: '2023-12-31',
    userId: 'admin@migoportal.com',
    userName: 'Alice Admin',
    companyId: 'comp_123'
  },
  {
    id: 'g2',
    title: 'Learn Advanced React Patterns',
    description: 'Complete the advanced course and refactor two legacy components.',
    type: 'Personal',
    visibility: 'Manager',
    status: 'In Progress',
    dueDate: '2023-12-15',
    userId: 'bob@migoportal.com',
    userName: 'Bob Employee',
    companyId: 'comp_123'
  },
  {
    id: 'g3',
    title: 'Launch New Design System',
    description: 'Complete documentation and migration guide for the new UI kit.',
    type: 'Business',
    visibility: 'Public',
    status: 'Completed',
    dueDate: '2023-11-30',
    userId: 'charlie@migoportal.com',
    userName: 'Charlie Designer',
    companyId: 'comp_123'
  }
];

export const MOCK_PAYROLL_RUNS: PayrollRun[] = [
  {
    id: 'pr1',
    period: 'November 2023',
    runDate: '2023-11-25',
    totalEmployees: 3,
    totalGross: 32000.00,
    totalNet: 24500.00,
    status: 'Completed',
    companyId: 'comp_123'
  },
  {
    id: 'pr2',
    period: 'December 2023',
    runDate: '2023-12-25',
    totalEmployees: 3,
    totalGross: 35000.00,
    totalNet: 27000.00,
    status: 'Processing',
    companyId: 'comp_123'
  }
];

export const MOCK_PAY_STUBS: PayStub[] = [
  {
    id: 'ps1',
    userId: 'bob@migoportal.com',
    userName: 'Bob Employee',
    period: 'November 2023',
    payDate: '2023-11-25',
    grossPay: 10416.67,
    netPay: 7850.00,
    deductions: [{ type: 'Health Insurance', amount: 200 }, { type: '401k', amount: 500 }],
    taxes: [{ type: 'Federal Tax', amount: 1560 }, { type: 'State Tax', amount: 306.67 }],
    currency: 'USD',
    status: 'Published',
    companyId: 'comp_123'
  },
  {
    id: 'ps2',
    userId: 'admin@migoportal.com',
    userName: 'Alice Admin',
    period: 'November 2023',
    payDate: '2023-11-25',
    grossPay: 12083.33,
    netPay: 9100.00,
    deductions: [{ type: 'Health Insurance', amount: 200 }, { type: '401k', amount: 600 }],
    taxes: [{ type: 'Federal Tax', amount: 1812.50 }, { type: 'State Tax', amount: 370.83 }],
    currency: 'USD',
    status: 'Published',
    companyId: 'comp_123'
  }
];