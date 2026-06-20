import { EngagementStatus } from "../../dtos/common/engagement.dto";
import { RoleName } from "../../dtos/common/role.dto";
import {
  IssueStatus,
  Priority,
  RiskStatus,
  TaskStatus,
} from "../../dtos/common/enums.dto";

const TS = "2026-06-19T10:00:00.000Z";

function paginatedMeta(total: number, limit = 20) {
  return {
    page: 1,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

function paginated<T>(data: T[], limit = 20) {
  return { data, meta: paginatedMeta(data.length, limit) };
}

export const SwaggerExamples = {
  auth: {
    loginAdmin: {
      summary: "Admin login",
      value: { email: "admin@gmail.com", password: "Admin@123" },
    },
    loginManager: {
      summary: "Manager login",
      value: { email: "manager@gmail.com", password: "Manager@123" },
    },
    loginAuditor: {
      summary: "Auditor login",
      value: { email: "auditor@gmail.com", password: "Auditor@123" },
    },
    loginResponse: {
      accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.sample.token",
      user: {
        uid: 1,
        name: "Admin",
        email: "admin@gmail.com",
        role: RoleName.ADMIN,
      },
    },
    meResponse: {
      uid: 1,
      name: "Admin",
      email: "admin@gmail.com",
      role: RoleName.ADMIN,
    },
  },
  users: {
    create: {
      summary: "Create user",
      value: {
        name: "Priya Sharma",
        email: "priya.auditor@test.com",
        password: "Auditor@123",
        role: RoleName.AUDITOR,
      },
    },
    update: {
      summary: "Update user",
      value: {
        id: 4,
        name: "Priya Sharma",
        role: RoleName.AUDITOR,
        isActive: true,
      },
    },
    listItem: {
      id: 3,
      name: "Auditor",
      email: "auditor@gmail.com",
      role: RoleName.AUDITOR,
      isActive: true,
      createdAt: TS,
    },
    detail: {
      id: 3,
      name: "Auditor",
      email: "auditor@gmail.com",
      role: RoleName.AUDITOR,
      isActive: true,
      createdAt: TS,
      updatedAt: TS,
    },
    paginated: paginated([
      {
        id: 1,
        name: "Admin",
        email: "admin@gmail.com",
        role: RoleName.ADMIN,
        isActive: true,
        createdAt: TS,
      },
      {
        id: 2,
        name: "Manager",
        email: "manager@gmail.com",
        role: RoleName.MANAGER,
        isActive: true,
        createdAt: TS,
      },
      {
        id: 3,
        name: "Auditor",
        email: "auditor@gmail.com",
        role: RoleName.AUDITOR,
        isActive: true,
        createdAt: TS,
      },
    ]),
  },
  clients: {
    create: {
      summary: "Create client",
      value: {
        name: "Acme Industries Ltd",
        code: "CL-001",
        email: "finance@acme-test.com",
        phone: "+91 98765 43210",
        address: "42 Industrial Estate, Mumbai 400001",
        gstNumber: "27AABCA1234A1Z5",
      },
    },
    update: {
      summary: "Update client",
      value: {
        id: 1,
        name: "Acme Industries Ltd",
        phone: "+91 91234 56780",
        isActive: true,
      },
    },
    listItem: {
      id: 1,
      name: "Acme Industries Ltd",
      email: "finance@acme-test.com",
      phone: "+91 98765 43210",
      gstNumber: "27AABCA1234A1Z5",
      isActive: true,
      createdAt: TS,
    },
    detail: {
      id: 1,
      name: "Acme Industries Ltd",
      code: "CL-001",
      email: "finance@acme-test.com",
      phone: "+91 98765 43210",
      address: "42 Industrial Estate, Mumbai 400001",
      gstNumber: "27AABCA1234A1Z5",
      isActive: true,
      createdAt: TS,
      updatedAt: TS,
    },
    paginated: paginated([
      {
        id: 1,
        name: "Acme Industries Ltd",
        email: "finance@acme-test.com",
        phone: "+91 98765 43210",
        gstNumber: "27AABCA1234A1Z5",
        isActive: true,
        createdAt: TS,
      },
      {
        id: 2,
        name: "Nova Retail Pvt Ltd",
        email: "accounts@nova-test.com",
        phone: "+91 91234 56780",
        gstNumber: "29AABCN5678B1Z2",
        isActive: true,
        createdAt: TS,
      },
    ]),
  },
  engagements: {
    create: {
      summary: "Create engagement",
      value: {
        clientId: 1,
        title: "FY 2025 Internal Audit — Acme",
        auditType: "Internal",
        financialYear: "2024-25",
        startDate: "2025-01-15",
        endDate: "2025-06-30",
        status: EngagementStatus.IN_PROGRESS,
        description: "Annual internal audit covering revenue, procurement, and payroll",
      },
    },
    update: {
      summary: "Update engagement",
      value: {
        id: 1,
        title: "FY 2025 Internal Audit — Acme (Revised)",
        status: EngagementStatus.IN_PROGRESS,
        description: "Fieldwork started",
      },
    },
    listItem: {
      id: 1,
      clientId: 1,
      clientName: "Acme Industries Ltd",
      title: "FY 2025 Internal Audit — Acme",
      auditType: "Internal",
      financialYear: "2024-25",
      status: EngagementStatus.IN_PROGRESS,
      startDate: "2025-01-15T00:00:00.000Z",
      endDate: "2025-06-30T00:00:00.000Z",
      createdAt: TS,
    },
    detail: {
      id: 1,
      clientId: 1,
      clientName: "Acme Industries Ltd",
      title: "FY 2025 Internal Audit — Acme",
      auditType: "Internal",
      financialYear: "2024-25",
      status: EngagementStatus.IN_PROGRESS,
      startDate: "2025-01-15T00:00:00.000Z",
      endDate: "2025-06-30T00:00:00.000Z",
      description: "Annual internal audit covering revenue, procurement, and payroll",
      createdAt: TS,
      updatedAt: TS,
    },
    paginated: paginated([
      {
        id: 1,
        clientId: 1,
        clientName: "Acme Industries Ltd",
        title: "FY 2025 Internal Audit — Acme",
        auditType: "Internal",
        financialYear: "2024-25",
        status: EngagementStatus.IN_PROGRESS,
        startDate: "2025-01-15T00:00:00.000Z",
        endDate: "2025-06-30T00:00:00.000Z",
        createdAt: TS,
      },
    ]),
  },
  scopes: {
    create: {
      summary: "Add scope",
      value: {
        name: "Revenue & Receivables",
        description: "Sales cutoff, credit notes, deferred revenue",
      },
    },
    listItem: {
      id: 1,
      name: "Revenue & Receivables",
      description: "Sales cutoff, credit notes, deferred revenue",
      isActive: true,
    },
    list: [
      {
        id: 1,
        name: "Revenue & Receivables",
        description: "Sales cutoff, credit notes, deferred revenue",
        isActive: true,
      },
      {
        id: 2,
        name: "Procurement & Payables",
        description: "PO approval, three-way match, vendor master",
        isActive: true,
      },
    ],
  },
  requiredDocuments: {
    create: {
      summary: "Add checklist item",
      value: { documentName: "Trial Balance", isRequired: true },
    },
    updateReceived: {
      summary: "Mark document as received",
      value: { isReceived: true },
    },
    listItem: {
      id: 1,
      documentName: "Trial Balance",
      isRequired: true,
      isReceived: true,
    },
    list: [
      { id: 1, documentName: "Trial Balance", isRequired: true, isReceived: true },
      { id: 2, documentName: "Bank Statements (12 months)", isRequired: true, isReceived: false },
    ],
  },
  issues: {
    create: {
      summary: "Create issue",
      value: {
        title: "Unrecorded sales invoices in December",
        description: "Q4 invoices not posted to ERP before year-end",
        severity: Priority.HIGH,
        responsiblePerson: "CFO — Acme Industries",
      },
    },
    update: {
      summary: "Update issue",
      value: {
        id: 1,
        status: IssueStatus.IN_PROGRESS,
        severity: Priority.HIGH,
      },
    },
    assign: { summary: "Assign to auditor", value: { assignedToId: 3 } },
    assignClient: { summary: "Assign to client", value: { clientId: 1 } },
    finding: {
      summary: "Add finding",
      value: {
        title: "₹12.4L revenue not recorded in ERP",
        description: "Invoices dated 28–31 Dec posted in January",
        severity: Priority.HIGH,
      },
    },
    listItem: {
      id: 1,
      engagementId: 1,
      engagementTitle: "FY 2025 Internal Audit — Acme",
      title: "Unrecorded sales invoices in December",
      severity: Priority.HIGH,
      status: IssueStatus.IN_PROGRESS,
      responsiblePerson: "CFO — Acme Industries",
      assignedClientName: "Acme Industries Ltd",
      findingsCount: 1,
      createdAt: TS,
    },
    detail: {
      id: 1,
      engagementId: 1,
      engagementTitle: "FY 2025 Internal Audit — Acme",
      title: "Unrecorded sales invoices in December",
      severity: Priority.HIGH,
      status: IssueStatus.IN_PROGRESS,
      responsiblePerson: "CFO — Acme Industries",
      assignedClientName: "Acme Industries Ltd",
      findingsCount: 1,
      createdAt: TS,
      description: "Q4 invoices not posted to ERP before year-end",
      assigneeName: "Auditor",
      assignedClientId: 1,
      findings: [
        {
          id: 1,
          title: "₹12.4L revenue not recorded in ERP",
          description: "Invoices dated 28–31 Dec posted in January",
          severity: Priority.HIGH,
          createdByName: "Auditor",
          createdAt: TS,
        },
      ],
      statusLogs: [
        {
          id: 1,
          oldStatus: IssueStatus.OPEN,
          newStatus: IssueStatus.IN_PROGRESS,
          changedByName: "Manager",
          createdAt: TS,
        },
      ],
      updatedAt: TS,
    },
    findingItem: {
      id: 1,
      title: "₹12.4L revenue not recorded in ERP",
      description: "Invoices dated 28–31 Dec posted in January",
      severity: Priority.HIGH,
      createdByName: "Auditor",
      createdAt: TS,
    },
    paginated: paginated([
      {
        id: 1,
        engagementId: 1,
        engagementTitle: "FY 2025 Internal Audit — Acme",
        title: "Unrecorded sales invoices in December",
        severity: Priority.HIGH,
        status: IssueStatus.IN_PROGRESS,
        responsiblePerson: "CFO — Acme Industries",
        assignedClientName: "Acme Industries Ltd",
        findingsCount: 1,
        createdAt: TS,
      },
      {
        id: 2,
        engagementId: 1,
        engagementTitle: "FY 2025 Internal Audit — Acme",
        title: "Duplicate vendor payments identified",
        severity: Priority.MEDIUM,
        status: IssueStatus.OPEN,
        responsiblePerson: "AP Lead",
        assignedClientName: "Acme Industries Ltd",
        findingsCount: 1,
        createdAt: TS,
      },
    ]),
  },
  tasks: {
    create: {
      summary: "Create task",
      value: {
        title: "Perform revenue substantive testing",
        description: "Sample 25 invoices across Q3 and Q4",
        status: TaskStatus.PENDING,
      },
    },
    update: {
      summary: "Update task",
      value: { id: 1, status: TaskStatus.IN_PROGRESS },
    },
    assign: { summary: "Assign to auditor", value: { assignedToId: 3 } },
    comment: {
      summary: "Add comment",
      value: { content: "Started reviewing Q4 sales invoices" },
    },
    listItem: {
      id: 1,
      engagementId: 1,
      engagementTitle: "FY 2025 Internal Audit — Acme",
      title: "Perform revenue substantive testing",
      description: "Sample 25 invoices across Q3 and Q4",
      status: TaskStatus.IN_PROGRESS,
      assigneeName: "Auditor",
      createdAt: TS,
    },
    detail: {
      id: 1,
      engagementId: 1,
      engagementTitle: "FY 2025 Internal Audit — Acme",
      title: "Perform revenue substantive testing",
      description: "Sample 25 invoices across Q3 and Q4",
      status: TaskStatus.IN_PROGRESS,
      assigneeName: "Auditor",
      createdAt: TS,
      comments: [
        {
          id: 1,
          authorName: "Auditor",
          content: "Started reviewing Q4 sales invoices",
          createdAt: TS,
        },
      ],
      updatedAt: TS,
    },
    paginated: paginated([
      {
        id: 1,
        engagementId: 1,
        engagementTitle: "FY 2025 Internal Audit — Acme",
        title: "Perform revenue substantive testing",
        description: "Sample 25 invoices across Q3 and Q4",
        status: TaskStatus.IN_PROGRESS,
        assigneeName: "Auditor",
        createdAt: TS,
      },
      {
        id: 2,
        engagementId: 1,
        engagementTitle: "FY 2025 Internal Audit — Acme",
        title: "Walkthrough procurement process",
        description: null,
        status: TaskStatus.PENDING,
        assigneeName: "Auditor",
        createdAt: TS,
      },
    ]),
  },
  risks: {
    create: {
      summary: "Create risk",
      value: {
        title: "Revenue recognition cutoff errors",
        description: "Q4 sales may be recorded in wrong period",
        priority: Priority.HIGH,
        status: RiskStatus.OPEN,
      },
    },
    update: {
      summary: "Update risk",
      value: { id: 1, status: RiskStatus.OPEN, priority: Priority.HIGH },
    },
    checklistCreate: {
      summary: "Add checklist item",
      value: { title: "Review Q4 sales invoices", sortOrder: 0 },
    },
    checklistUpdate: {
      summary: "Mark checklist complete",
      value: { id: 1, isCompleted: true },
    },
    assignChecklist: { summary: "Assign checklist", value: { assignedToId: 3 } },
    listItem: {
      id: 1,
      engagementId: 1,
      title: "Revenue recognition cutoff errors",
      description: "Q4 sales may be recorded in wrong period",
      priority: Priority.HIGH,
      status: RiskStatus.OPEN,
      checklistCount: 3,
      completedChecklistCount: 1,
      createdAt: TS,
    },
    checklistItem: {
      id: 1,
      title: "Review Q4 sales invoices",
      isCompleted: false,
      sortOrder: 0,
      assigneeName: "Auditor",
    },
    checklistList: [
      {
        id: 1,
        title: "Review Q4 sales invoices",
        isCompleted: false,
        sortOrder: 0,
        assigneeName: "Auditor",
      },
      {
        id: 2,
        title: "Test cutoff journal entries",
        isCompleted: true,
        sortOrder: 1,
        assigneeName: "Auditor",
      },
    ],
    paginated: paginated([
      {
        id: 1,
        engagementId: 1,
        title: "Revenue recognition cutoff errors",
        description: "Q4 sales may be recorded in wrong period",
        priority: Priority.HIGH,
        status: RiskStatus.OPEN,
        checklistCount: 3,
        completedChecklistCount: 1,
        createdAt: TS,
      },
    ]),
  },
  documents: {
    categoryCreate: {
      summary: "Create category",
      value: { name: "Financial", description: "Financial statements and records" },
    },
    category: {
      id: 1,
      name: "Financial",
      description: "Financial statements and records",
      createdAt: TS,
    },
    categories: [
      { id: 1, name: "Financial", description: "Financial statements and records", createdAt: TS },
      { id: 2, name: "Tax", description: "GST and tax related documents", createdAt: TS },
    ],
    listItem: {
      id: 1,
      clientId: 1,
      clientName: "Acme Industries Ltd",
      engagementId: 1,
      engagementTitle: "FY 2025 Internal Audit — Acme",
      categoryId: 1,
      categoryName: "Financial",
      originalName: "Acme_Trial_Balance_FY25.xlsx",
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      fileSize: 245760,
      uploadedByName: "Manager",
      version: 1,
      parentDocumentId: null,
      rootDocumentId: 1,
      versionCount: 1,
      createdAt: TS,
    },
    log: {
      id: 1,
      action: "UPLOAD",
      performedByName: "Manager",
      details: "Initial upload",
      createdAt: TS,
    },
    logs: [
      {
        id: 1,
        action: "UPLOAD",
        performedByName: "Manager",
        details: "Initial upload",
        createdAt: TS,
      },
      {
        id: 2,
        action: "DOWNLOAD",
        performedByName: "Auditor",
        details: null,
        createdAt: TS,
      },
    ],
    paginated: paginated([
      {
        id: 1,
        clientId: 1,
        clientName: "Acme Industries Ltd",
        engagementId: 1,
        engagementTitle: "FY 2025 Internal Audit — Acme",
        categoryId: 1,
        categoryName: "Financial",
        originalName: "Acme_Trial_Balance_FY25.xlsx",
        mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        fileSize: 245760,
        uploadedByName: "Manager",
        version: 1,
        parentDocumentId: null,
        rootDocumentId: 1,
        versionCount: 1,
        createdAt: TS,
      },
    ]),
  },
  reports: {
    dashboard: {
      totalClients: 5,
      totalAudits: 6,
      completedAudits: 2,
      openRisks: 4,
      pendingTasks: 6,
      openIssues: 4,
      resolvedIssues: 3,
      workload: {
        tasksByAssignee: [
          { userId: 3, userName: "Auditor", pending: 3, inProgress: 2 },
        ],
        openChecklistsByAssignee: [
          { userId: 3, userName: "Auditor", openCount: 4 },
        ],
      },
    },
    myDashboard: {
      pendingTasks: 2,
      inProgressTasks: 1,
      openChecklists: 3,
      openIssues: 2,
      myTasks: [
        {
          id: 1,
          title: "Perform revenue substantive testing",
          engagementTitle: "FY 2025 Internal Audit — Acme",
          status: TaskStatus.IN_PROGRESS,
        },
      ],
      myChecklists: [
        {
          id: 1,
          title: "Review Q4 sales invoices",
          riskId: 1,
          riskTitle: "Revenue recognition cutoff errors",
          engagementTitle: "FY 2025 Internal Audit — Acme",
        },
      ],
      myIssues: [
        {
          id: 1,
          title: "Unrecorded sales invoices in December",
          engagementTitle: "FY 2025 Internal Audit — Acme",
          status: IssueStatus.IN_PROGRESS,
          severity: Priority.HIGH,
        },
      ],
    },
    auditSummary: {
      engagementTitle: "FY 2025 Internal Audit — Acme",
      clientName: "Acme Industries Ltd",
      totalRisks: 2,
      openIssues: 2,
      resolvedIssues: 0,
      pendingTasks: 2,
      completedTasks: 1,
      totalDocuments: 2,
    },
    riskReport: {
      engagementTitle: "FY 2025 Internal Audit — Acme",
      high: 1,
      medium: 1,
      low: 0,
      items: [
        {
          title: "Revenue recognition cutoff errors",
          priority: Priority.HIGH,
          status: RiskStatus.OPEN,
          checklistProgress: "1/3",
        },
        {
          title: "Weak segregation in procurement",
          priority: Priority.MEDIUM,
          status: RiskStatus.OPEN,
          checklistProgress: "0/2",
        },
      ],
    },
    findingsReport: {
      engagementTitle: "FY 2025 Internal Audit — Acme",
      items: [
        {
          issueName: "Unrecorded sales invoices in December",
          findingTitle: "₹12.4L revenue not recorded in ERP",
          severity: Priority.HIGH,
          status: IssueStatus.IN_PROGRESS,
        },
      ],
    },
  },
  roles: {
    list: [
      {
        id: 1,
        name: RoleName.ADMIN,
        description: "Full system access",
        permissions: ["Create, update, and deactivate users", "Manage all modules"],
      },
      {
        id: 2,
        name: RoleName.MANAGER,
        description: "Manage clients and audit engagements",
        permissions: ["Manage clients and engagements", "Assign tasks and issues"],
      },
      {
        id: 3,
        name: RoleName.AUDITOR,
        description: "Execute audit work and review documents",
        permissions: ["View assigned work", "Update tasks and checklists"],
      },
    ],
    permissionGrid: {
      roleId: 2,
      role: RoleName.MANAGER,
      description: "Manage clients and audit engagements",
      groups: [
        {
          key: "audit",
          label: "Audit modules",
          resources: [
            {
              key: "clients",
              label: "Clients",
              permissions: {
                create: true,
                editOwn: true,
                editAny: true,
                deleteOwn: false,
                deleteAny: false,
              },
            },
          ],
        },
      ],
    },
    updatePermissions: {
      summary: "Update permissions",
      value: {
        permissions: {
          clients: { create: true, editOwn: true, editAny: true, deleteOwn: false, deleteAny: false },
        },
      },
    },
  },
  errors: {
    validation: {
      success: false,
      error: {
        statusCode: 400,
        message: "Validation failed",
        errorCode: "VALIDATION_ERROR",
        validationErrors: ["email must be an email"],
        timestamp: TS,
        path: "/auth/login",
      },
    },
    unauthorized: {
      success: false,
      error: {
        statusCode: 401,
        message: "Invalid credentials",
        errorCode: "UNAUTHORIZED",
        timestamp: TS,
        path: "/auth/login",
      },
    },
    forbidden: {
      success: false,
      error: {
        statusCode: 403,
        message: "Insufficient permissions",
        errorCode: "FORBIDDEN",
        timestamp: TS,
        path: "/users",
      },
    },
    notFound: {
      success: false,
      error: {
        statusCode: 404,
        message: "Client 99 not found",
        errorCode: "NOT_FOUND",
        timestamp: TS,
        path: "/clients/99",
      },
    },
  },
} as const;
