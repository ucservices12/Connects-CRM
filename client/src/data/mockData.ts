import { User, Lead, Comment, CallLog, Document, Employee, Notification, Activity, Analytics } from '../types';

export const mockUsers: User[] = [
    {
        id: '1',
        name: 'Admin User',
        email: 'admin@company.com',
        role: 'admin',
        organizationName: 'FinTech Solutions',
        createdAt: '2024-01-01T00:00:00Z',
        isActive: true,
        lastLogin: '2024-12-01T09:00:00Z'
    },
    {
        id: '2',
        name: 'John Smith',
        email: 'john@company.com',
        role: 'employee',
        organizationName: 'FinTech Solutions',
        createdAt: '2024-01-02T00:00:00Z',
        isActive: true,
        lastLogin: '2024-12-01T08:30:00Z'
    },
    {
        id: '3',
        name: 'Sarah Johnson',
        email: 'sarah@company.com',
        role: 'employee',
        organizationName: 'FinTech Solutions',
        createdAt: '2024-01-03T00:00:00Z',
        isActive: true,
        lastLogin: '2024-12-01T08:45:00Z'
    },
    {
        id: '4',
        name: 'Mike Wilson',
        email: 'mike@company.com',
        role: 'employee',
        organizationName: 'FinTech Solutions',
        createdAt: '2024-01-04T00:00:00Z',
        isActive: true,
        lastLogin: '2024-11-30T17:30:00Z'
    },
    {
        id: '5',
        name: 'Emily Davis',
        email: 'emily@company.com',
        role: 'employee',
        organizationName: 'FinTech Solutions',
        createdAt: '2024-01-05T00:00:00Z',
        isActive: false,
        lastLogin: '2024-11-28T16:00:00Z'
    }
];

export const mockEmployees: Employee[] = [
    {
        id: '2',
        name: 'John Smith',
        email: 'john@company.com',
        phone: '+1234567890',
        department: 'Sales',
        designation: 'Senior Sales Executive',
        assignedLeads: 25,
        completedLeads: 18,
        conversionRate: 72,
        createdAt: '2024-01-02T00:00:00Z',
        isActive: true,
        lastLogin: '2024-12-01T08:30:00Z',
        targetLeads: 30
    },
    {
        id: '3',
        name: 'Sarah Johnson',
        email: 'sarah@company.com',
        phone: '+1234567891',
        department: 'Sales',
        designation: 'Sales Executive',
        assignedLeads: 22,
        completedLeads: 16,
        conversionRate: 73,
        createdAt: '2024-01-03T00:00:00Z',
        isActive: true,
        lastLogin: '2024-12-01T08:45:00Z',
        targetLeads: 25
    },
    {
        id: '4',
        name: 'Mike Wilson',
        email: 'mike@company.com',
        phone: '+1234567892',
        department: 'Sales',
        designation: 'Junior Sales Executive',
        assignedLeads: 18,
        completedLeads: 12,
        conversionRate: 67,
        createdAt: '2024-01-04T00:00:00Z',
        isActive: true,
        lastLogin: '2024-11-30T17:30:00Z',
        targetLeads: 20
    },
    {
        id: '5',
        name: 'Emily Davis',
        email: 'emily@company.com',
        phone: '+1234567893',
        department: 'Sales',
        designation: 'Sales Executive',
        assignedLeads: 15,
        completedLeads: 8,
        conversionRate: 53,
        createdAt: '2024-01-05T00:00:00Z',
        isActive: false,
        lastLogin: '2024-11-28T16:00:00Z',
        targetLeads: 25
    }
];

export const mockLeads: Lead[] = [
    {
        id: '1',
        customerName: 'Robert Wilson',
        phone: '+1234567892',
        email: 'robert@email.com',
        city: 'New York',
        state: 'NY',
        address: '123 Main St, New York, NY 10001',
        productType: 'Personal Loan',
        loanAmount: 50000,
        monthlyIncome: 8000,
        employmentType: 'Salaried',
        creditScore: 750,
        status: 'New',
        assignedTo: '2',
        assignedToName: 'John Smith',
        createdAt: '2024-12-01T09:00:00Z',
        updatedAt: '2024-12-01T09:00:00Z',
        priority: 'High',
        source: 'Website',
        followUpDate: '2024-12-02T10:00:00Z',
        notes: 'Customer interested in quick approval'
    },
    {
        id: '2',
        customerName: 'Emily Davis',
        phone: '+1234567893',
        email: 'emily@email.com',
        city: 'Los Angeles',
        state: 'CA',
        address: '456 Oak Ave, Los Angeles, CA 90210',
        productType: 'Home Loan',
        loanAmount: 350000,
        monthlyIncome: 12000,
        employmentType: 'Salaried',
        creditScore: 780,
        status: 'In Progress',
        assignedTo: '2',
        assignedToName: 'John Smith',
        createdAt: '2024-11-30T14:30:00Z',
        updatedAt: '2024-12-01T10:15:00Z',
        priority: 'Medium',
        source: 'Referral',
        followUpDate: '2024-12-03T14:00:00Z',
        notes: 'Documents under review'
    },
    {
        id: '3',
        customerName: 'Michael Brown',
        phone: '+1234567894',
        email: 'michael@email.com',
        city: 'Chicago',
        state: 'IL',
        address: '789 Pine St, Chicago, IL 60601',
        productType: 'Business Loan',
        loanAmount: 100000,
        monthlyIncome: 15000,
        employmentType: 'Business Owner',
        creditScore: 720,
        status: 'Approved',
        assignedTo: '3',
        assignedToName: 'Sarah Johnson',
        createdAt: '2024-11-29T11:20:00Z',
        updatedAt: '2024-12-01T16:45:00Z',
        priority: 'High',
        source: 'Phone Call',
        notes: 'Approved for full amount'
    },
    {
        id: '4',
        customerName: 'Jennifer Garcia',
        phone: '+1234567895',
        email: 'jennifer@email.com',
        city: 'Houston',
        state: 'TX',
        address: '321 Elm St, Houston, TX 77001',
        productType: 'Personal Loan',
        loanAmount: 25000,
        monthlyIncome: 6000,
        employmentType: 'Salaried',
        creditScore: 680,
        status: 'Done',
        assignedTo: '3',
        assignedToName: 'Sarah Johnson',
        createdAt: '2024-11-28T08:15:00Z',
        updatedAt: '2024-11-30T12:30:00Z',
        priority: 'Low',
        source: 'Social Media',
        notes: 'Loan disbursed successfully'
    },
    {
        id: '5',
        customerName: 'David Miller',
        phone: '+1234567896',
        email: 'david@email.com',
        city: 'Phoenix',
        state: 'AZ',
        address: '654 Cedar Ave, Phoenix, AZ 85001',
        productType: 'Home Loan',
        loanAmount: 275000,
        monthlyIncome: 10000,
        employmentType: 'Self-Employed',
        creditScore: 700,
        status: 'In Progress',
        assignedTo: '2',
        assignedToName: 'John Smith',
        createdAt: '2024-11-27T15:45:00Z',
        updatedAt: '2024-12-01T09:20:00Z',
        priority: 'Medium',
        source: 'Email',
        followUpDate: '2024-12-04T11:00:00Z',
        notes: 'Waiting for income verification'
    },
    {
        id: '6',
        customerName: 'Lisa Anderson',
        phone: '+1234567897',
        email: 'lisa@email.com',
        city: 'Miami',
        state: 'FL',
        address: '987 Beach Blvd, Miami, FL 33101',
        productType: 'Car Loan',
        loanAmount: 45000,
        monthlyIncome: 7500,
        employmentType: 'Salaried',
        creditScore: 740,
        status: 'New',
        assignedTo: '4',
        assignedToName: 'Mike Wilson',
        createdAt: '2024-12-01T11:30:00Z',
        updatedAt: '2024-12-01T11:30:00Z',
        priority: 'Medium',
        source: 'Website',
        followUpDate: '2024-12-02T15:00:00Z',
        notes: 'Interested in luxury car financing'
    },
    {
        id: '7',
        customerName: 'James Taylor',
        phone: '+1234567898',
        email: 'james@email.com',
        city: 'Seattle',
        state: 'WA',
        address: '147 Mountain View, Seattle, WA 98101',
        productType: 'Education Loan',
        loanAmount: 80000,
        monthlyIncome: 5000,
        employmentType: 'Salaried',
        status: 'On Hold',
        assignedTo: '4',
        assignedToName: 'Mike Wilson',
        createdAt: '2024-11-26T13:20:00Z',
        updatedAt: '2024-11-29T14:15:00Z',
        priority: 'Low',
        source: 'Referral',
        notes: 'Waiting for admission confirmation'
    },
    {
        id: '8',
        customerName: 'Amanda White',
        phone: '+1234567899',
        email: 'amanda@email.com',
        city: 'Boston',
        state: 'MA',
        address: '258 Harbor St, Boston, MA 02101',
        productType: 'Business Loan',
        loanAmount: 150000,
        monthlyIncome: 20000,
        employmentType: 'Business Owner',
        creditScore: 760,
        status: 'Rejected',
        assignedTo: '3',
        assignedToName: 'Sarah Johnson',
        createdAt: '2024-11-25T10:00:00Z',
        updatedAt: '2024-11-28T16:30:00Z',
        priority: 'High',
        source: 'Phone Call',
        notes: 'Insufficient collateral'
    }
];

export const mockTargets: Target[] = [
    {
        id: '1',
        employeeId: '2',
        employeeName: 'John Smith',
        type: 'monthly',
        targetValue: 30,
        achievedValue: 25,
        period: 'December 2024',
        status: 'active',
        createdAt: '2024-12-01T00:00:00Z',
        deadline: '2024-12-31T23:59:59Z'
    },
    {
        id: '2',
        employeeId: '3',
        employeeName: 'Sarah Johnson',
        type: 'monthly',
        targetValue: 25,
        achievedValue: 22,
        period: 'December 2024',
        status: 'active',
        createdAt: '2024-12-01T00:00:00Z',
        deadline: '2024-12-31T23:59:59Z'
    },
    {
        id: '3',
        employeeId: '4',
        employeeName: 'Mike Wilson',
        type: 'monthly',
        targetValue: 20,
        achievedValue: 18,
        period: 'December 2024',
        status: 'active',
        createdAt: '2024-12-01T00:00:00Z',
        deadline: '2024-12-31T23:59:59Z'
    },
    {
        id: '4',
        employeeId: '2',
        employeeName: 'John Smith',
        type: 'quarterly',
        targetValue: 90,
        achievedValue: 78,
        period: 'Q4 2024',
        status: 'active',
        createdAt: '2024-10-01T00:00:00Z',
        deadline: '2024-12-31T23:59:59Z'
    }
];

export const mockComments: Comment[] = [
    {
        id: '1',
        leadId: '1',
        userId: '1',
        userName: 'Admin User',
        userRole: 'admin',
        content: 'This is a high-priority lead. Please contact within 24 hours.',
        createdAt: '2024-12-01T09:15:00Z',
        isInternal: true
    },
    {
        id: '2',
        leadId: '1',
        userId: '2',
        userName: 'John Smith',
        userRole: 'employee',
        content: 'Understood. I will reach out to the customer today.',
        createdAt: '2024-12-01T09:30:00Z',
        isInternal: true
    },
    {
        id: '3',
        leadId: '2',
        userId: '2',
        userName: 'John Smith',
        userRole: 'employee',
        content: 'Customer is interested. Scheduling a meeting for document verification.',
        createdAt: '2024-12-01T10:20:00Z',
        isInternal: false
    },
    {
        id: '4',
        leadId: '3',
        userId: '3',
        userName: 'Sarah Johnson',
        userRole: 'employee',
        content: 'All documents verified. Proceeding with approval process.',
        createdAt: '2024-12-01T14:30:00Z',
        isInternal: true
    },
    {
        id: '5',
        leadId: '5',
        userId: '2',
        userName: 'John Smith',
        userRole: 'employee',
        content: 'Customer provided additional income documents. Under review.',
        createdAt: '2024-12-01T16:00:00Z',
        isInternal: false
    }
];

export const mockCallLogs: CallLog[] = [
    {
        id: '1',
        leadId: '1',
        calledBy: '2',
        calledByName: 'John Smith',
        duration: 300,
        callType: 'Outgoing',
        status: 'Completed',
        notes: 'Customer is interested in personal loan. Discussed terms and requirements.',
        createdAt: '2024-12-01T10:00:00Z',
        recordingUrl: '/recordings/call_1.mp3'
    },
    {
        id: '2',
        leadId: '2',
        calledBy: '2',
        calledByName: 'John Smith',
        duration: 450,
        callType: 'Outgoing',
        status: 'Completed',
        notes: 'Explained home loan process. Customer needs time to gather documents.',
        createdAt: '2024-12-01T11:15:00Z',
        recordingUrl: '/recordings/call_2.mp3'
    },
    {
        id: '3',
        leadId: '3',
        calledBy: '3',
        calledByName: 'Sarah Johnson',
        duration: 180,
        callType: 'Outgoing',
        status: 'No Answer',
        notes: 'Customer did not answer. Will try again later.',
        createdAt: '2024-12-01T13:30:00Z'
    },
    {
        id: '4',
        leadId: '5',
        calledBy: '2',
        calledByName: 'John Smith',
        duration: 600,
        callType: 'Outgoing',
        status: 'Completed',
        notes: 'Detailed discussion about home loan options and interest rates.',
        createdAt: '2024-12-01T15:45:00Z',
        recordingUrl: '/recordings/call_4.mp3'
    },
    {
        id: '5',
        leadId: '6',
        calledBy: '4',
        calledByName: 'Mike Wilson',
        duration: 240,
        callType: 'Outgoing',
        status: 'Completed',
        notes: 'Customer interested in car loan. Sent application form.',
        createdAt: '2024-12-01T16:30:00Z'
    }
];

export const mockDocuments: Document[] = [
    {
        id: '1',
        leadId: '2',
        name: 'aadhaar_emily_davis.pdf',
        type: 'Aadhaar',
        url: '/documents/aadhaar_emily_davis.pdf',
        uploadedBy: '2',
        uploadedByName: 'John Smith',
        uploadedAt: '2024-12-01T12:00:00Z',
        size: 1024000,
        status: 'Verified'
    },
    {
        id: '2',
        leadId: '2',
        name: 'pan_emily_davis.pdf',
        type: 'PAN',
        url: '/documents/pan_emily_davis.pdf',
        uploadedBy: '2',
        uploadedByName: 'John Smith',
        uploadedAt: '2024-12-01T12:05:00Z',
        size: 512000,
        status: 'Verified'
    },
    {
        id: '3',
        leadId: '2',
        name: 'salary_slip_emily_davis.pdf',
        type: 'Salary Slip',
        url: '/documents/salary_slip_emily_davis.pdf',
        uploadedBy: '2',
        uploadedByName: 'John Smith',
        uploadedAt: '2024-12-01T12:10:00Z',
        size: 768000,
        status: 'Pending'
    },
    {
        id: '4',
        leadId: '3',
        name: 'bank_statement_michael_brown.pdf',
        type: 'Bank Statement',
        url: '/documents/bank_statement_michael_brown.pdf',
        uploadedBy: '3',
        uploadedByName: 'Sarah Johnson',
        uploadedAt: '2024-11-30T14:20:00Z',
        size: 2048000,
        status: 'Verified'
    },
    {
        id: '5',
        leadId: '5',
        name: 'itr_david_miller.pdf',
        type: 'ITR',
        url: '/documents/itr_david_miller.pdf',
        uploadedBy: '2',
        uploadedByName: 'John Smith',
        uploadedAt: '2024-12-01T09:30:00Z',
        size: 1536000,
        status: 'Pending'
    }
];

export const mockNotifications: Notification[] = [
    {
        id: '1',
        userId: '2',
        title: 'New Lead Assigned',
        message: 'You have been assigned a new lead: Robert Wilson',
        type: 'info',
        isRead: false,
        createdAt: '2024-12-01T09:00:00Z',
        actionUrl: '/lead/1'
    },
    {
        id: '2',
        userId: '2',
        title: 'Follow-up Reminder',
        message: 'Follow-up required for Emily Davis',
        type: 'warning',
        isRead: false,
        createdAt: '2024-12-01T08:30:00Z',
        actionUrl: '/lead/2'
    },
    {
        id: '3',
        userId: '3',
        title: 'Lead Approved',
        message: 'Michael Brown\'s business loan has been approved',
        type: 'success',
        isRead: true,
        createdAt: '2024-12-01T16:45:00Z',
        actionUrl: '/lead/3'
    },
    {
        id: '4',
        userId: '1',
        title: 'Monthly Target Alert',
        message: 'Team is 85% towards monthly target',
        type: 'info',
        isRead: false,
        createdAt: '2024-12-01T07:00:00Z'
    }
];

export const mockActivities: Activity[] = [
    {
        id: '1',
        userId: '2',
        userName: 'John Smith',
        action: 'Called',
        description: 'Made a call to Robert Wilson',
        entityType: 'lead',
        entityId: '1',
        createdAt: '2024-12-01T10:00:00Z'
    },
    {
        id: '2',
        userId: '3',
        userName: 'Sarah Johnson',
        action: 'Updated Status',
        description: 'Changed Michael Brown\'s status to Approved',
        entityType: 'lead',
        entityId: '3',
        createdAt: '2024-12-01T16:45:00Z'
    },
    {
        id: '3',
        userId: '2',
        userName: 'John Smith',
        action: 'Uploaded Document',
        description: 'Uploaded Aadhaar for Emily Davis',
        entityType: 'document',
        entityId: '1',
        createdAt: '2024-12-01T12:00:00Z'
    },
    {
        id: '4',
        userId: '1',
        userName: 'Admin User',
        action: 'Assigned Lead',
        description: 'Assigned Lisa Anderson to Mike Wilson',
        entityType: 'lead',
        entityId: '6',
        createdAt: '2024-12-01T11:30:00Z'
    }
];

export const mockAnalytics: Analytics = {
    totalLeads: 8,
    newLeads: 2,
    inProgressLeads: 2,
    approvedLeads: 1,
    rejectedLeads: 1,
    conversionRate: 62.5,
    averageResponseTime: 4.2,
    topPerformers: mockEmployees.slice(0, 3),
    leadsBySource: [
        { source: 'Website', count: 3 },
        { source: 'Referral', count: 2 },
        { source: 'Phone Call', count: 2 },
        { source: 'Email', count: 1 },
        { source: 'Social Media', count: 1 }
    ],
    leadsByProduct: [
        { product: 'Personal Loan', count: 2 },
        { product: 'Home Loan', count: 2 },
        { product: 'Business Loan', count: 2 },
        { product: 'Car Loan', count: 1 },
        { product: 'Education Loan', count: 1 }
    ],
    monthlyTrends: [
        { month: 'Aug', leads: 45, conversions: 28 },
        { month: 'Sep', leads: 52, conversions: 31 },
        { month: 'Oct', leads: 48, conversions: 29 },
        { month: 'Nov', leads: 58, conversions: 36 },
        { month: 'Dec', leads: 23, conversions: 14 }
    ]
};