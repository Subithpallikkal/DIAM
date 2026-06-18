import { EngagementStatus } from "../../dtos/common/engagement.dto";
import { RoleName } from "../../dtos/common/role.dto";

export const SwaggerExamples = {
  auth: {
    loginAdmin: {
      summary: "Admin login",
      value: {
        email: "admin@demo.com",
        password: "Admin@123",
      },
    },
    loginManager: {
      summary: "Manager login",
      value: {
        email: "manager@demo.com",
        password: "Manager@123",
      },
    },
    loginAuditor: {
      summary: "Auditor login",
      value: {
        email: "auditor@demo.com",
        password: "Auditor@123",
      },
    },
    loginResponse: {
      accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.sample.token",
      user: {
        uid: 1,
        name: "Demo Admin",
        email: "admin@demo.com",
        role: RoleName.ADMIN,
      },
    },
    meResponse: {
      uid: 1,
      name: "Demo Admin",
      email: "admin@demo.com",
      role: RoleName.ADMIN,
    },
  },
  users: {
    list: [
      {
        uid: 1,
        name: "Demo Admin",
        email: "admin@demo.com",
        role: RoleName.ADMIN,
        isActive: true,
        createdAt: "2026-06-13T07:18:47.000Z",
      },
      {
        uid: 2,
        name: "Demo Manager",
        email: "manager@demo.com",
        role: RoleName.MANAGER,
        isActive: true,
        createdAt: "2026-06-13T07:18:47.000Z",
      },
    ],
  },
  clients: {
    create: {
      summary: "Create client",
      value: {
        name: "ABC Pvt Ltd",
        code: "ABC001",
        email: "contact@abc.com",
        phone: "+91-9876543210",
        address: "123 Business Park, Mumbai, Maharashtra",
        gstNumber: "27AABCU9603R1ZM",
      },
    },
    update: {
      summary: "Update client",
      value: {
        name: "ABC Pvt Ltd (Updated)",
        phone: "+91-9123456780",
        isActive: true,
      },
    },
    listItem: {
      id: 1,
      name: "ABC Pvt Ltd",
      email: "contact@abc.com",
      phone: "+91-9876543210",
      gstNumber: "27AABCU9603R1ZM",
      isActive: true,
      createdAt: "2026-06-13T07:18:47.000Z",
    },
    detail: {
      id: 1,
      name: "ABC Pvt Ltd",
      code: "ABC001",
      email: "contact@abc.com",
      phone: "+91-9876543210",
      address: "123 Business Park, Mumbai, Maharashtra",
      gstNumber: "27AABCU9603R1ZM",
      isActive: true,
      createdAt: "2026-06-13T07:18:47.000Z",
      updatedAt: "2026-06-13T07:18:47.000Z",
    },
    list: [
      {
        id: 1,
        name: "ABC Pvt Ltd",
        email: "contact@abc.com",
        phone: "+91-9876543210",
        gstNumber: "27AABCU9603R1ZM",
        isActive: true,
        createdAt: "2026-06-13T07:18:47.000Z",
      },
    ],
  },
  engagements: {
    create: {
      summary: "Create engagement",
      value: {
        clientId: 1,
        title: "Financial Audit 2026",
        auditType: "Financial",
        financialYear: "2025-26",
        startDate: "2026-04-01",
        endDate: "2026-06-30",
        status: EngagementStatus.DRAFT,
        description: "Annual statutory financial audit",
      },
    },
    update: {
      summary: "Update engagement",
      value: {
        title: "Financial Audit 2026 (Revised)",
        status: EngagementStatus.IN_PROGRESS,
        description: "Audit fieldwork started",
      },
    },
    listItem: {
      id: 1,
      clientId: 1,
      clientName: "ABC Pvt Ltd",
      title: "Financial Audit 2026",
      auditType: "Financial",
      financialYear: "2025-26",
      status: EngagementStatus.DRAFT,
      startDate: "2026-04-01T00:00:00.000Z",
      endDate: "2026-06-30T00:00:00.000Z",
      createdAt: "2026-06-13T07:18:47.000Z",
    },
    detail: {
      id: 1,
      clientId: 1,
      clientName: "ABC Pvt Ltd",
      title: "Financial Audit 2026",
      auditType: "Financial",
      financialYear: "2025-26",
      status: EngagementStatus.DRAFT,
      startDate: "2026-04-01T00:00:00.000Z",
      endDate: "2026-06-30T00:00:00.000Z",
      description: "Annual statutory financial audit",
      createdAt: "2026-06-13T07:18:47.000Z",
      updatedAt: "2026-06-13T07:18:47.000Z",
    },
    list: [
      {
        id: 1,
        clientId: 1,
        clientName: "ABC Pvt Ltd",
        title: "Financial Audit 2026",
        auditType: "Financial",
        financialYear: "2025-26",
        status: EngagementStatus.DRAFT,
        startDate: "2026-04-01T00:00:00.000Z",
        endDate: "2026-06-30T00:00:00.000Z",
        createdAt: "2026-06-13T07:18:47.000Z",
      },
    ],
  },
  scopes: {
    create: {
      summary: "Add scope",
      value: {
        name: "Sales",
        description: "Review sales invoices and revenue recognition",
      },
    },
    listItem: {
      id: 1,
      name: "Sales",
      description: "Review sales invoices and revenue recognition",
      isActive: true,
    },
    list: [
      {
        id: 1,
        name: "Sales",
        description: "Review sales invoices and revenue recognition",
        isActive: true,
      },
      {
        id: 2,
        name: "Purchase",
        description: "Review purchase orders and vendor payments",
        isActive: true,
      },
    ],
  },
  requiredDocuments: {
    create: {
      summary: "Add checklist item",
      value: {
        documentName: "Bank Statement",
        isRequired: true,
      },
    },
    updateReceived: {
      summary: "Mark document as received",
      value: {
        isReceived: true,
      },
    },
    listItem: {
      id: 1,
      documentName: "Bank Statement",
      isRequired: true,
      isReceived: false,
    },
    list: [
      {
        id: 1,
        documentName: "Bank Statement",
        isRequired: true,
        isReceived: false,
      },
      {
        id: 2,
        documentName: "GST Return",
        isRequired: true,
        isReceived: true,
      },
    ],
  },
  errors: {
    validation: {
      success: false,
      error: {
        statusCode: 400,
        message: "Validation failed",
        errorCode: "VALIDATION_ERROR",
        validationErrors: ["email must be an email"],
        timestamp: "2026-06-13T07:18:47.000Z",
        path: "/auth/login",
      },
    },
    unauthorized: {
      success: false,
      error: {
        statusCode: 401,
        message: "Invalid credentials",
        errorCode: "UNAUTHORIZED",
        timestamp: "2026-06-13T07:18:47.000Z",
        path: "/auth/login",
      },
    },
    forbidden: {
      success: false,
      error: {
        statusCode: 403,
        message: "Insufficient permissions",
        errorCode: "FORBIDDEN",
        timestamp: "2026-06-13T07:18:47.000Z",
        path: "/users",
      },
    },
    notFound: {
      success: false,
      error: {
        statusCode: 404,
        message: "Client 99 not found",
        errorCode: "NOT_FOUND",
        timestamp: "2026-06-13T07:18:47.000Z",
        path: "/clients/99",
      },
    },
  },
} as const;
