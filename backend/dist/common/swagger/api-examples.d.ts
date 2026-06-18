import { EngagementStatus } from "../../dtos/common/engagement.dto";
import { RoleName } from "../../dtos/common/role.dto";
export declare const SwaggerExamples: {
    readonly auth: {
        readonly loginAdmin: {
            readonly summary: "Admin login";
            readonly value: {
                readonly email: "admin@demo.com";
                readonly password: "Admin@123";
            };
        };
        readonly loginManager: {
            readonly summary: "Manager login";
            readonly value: {
                readonly email: "manager@demo.com";
                readonly password: "Manager@123";
            };
        };
        readonly loginAuditor: {
            readonly summary: "Auditor login";
            readonly value: {
                readonly email: "auditor@demo.com";
                readonly password: "Auditor@123";
            };
        };
        readonly loginResponse: {
            readonly accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.sample.token";
            readonly user: {
                readonly uid: 1;
                readonly name: "Demo Admin";
                readonly email: "admin@demo.com";
                readonly role: RoleName.ADMIN;
            };
        };
        readonly meResponse: {
            readonly uid: 1;
            readonly name: "Demo Admin";
            readonly email: "admin@demo.com";
            readonly role: RoleName.ADMIN;
        };
    };
    readonly users: {
        readonly list: readonly [{
            readonly uid: 1;
            readonly name: "Demo Admin";
            readonly email: "admin@demo.com";
            readonly role: RoleName.ADMIN;
            readonly isActive: true;
            readonly createdAt: "2026-06-13T07:18:47.000Z";
        }, {
            readonly uid: 2;
            readonly name: "Demo Manager";
            readonly email: "manager@demo.com";
            readonly role: RoleName.MANAGER;
            readonly isActive: true;
            readonly createdAt: "2026-06-13T07:18:47.000Z";
        }];
    };
    readonly clients: {
        readonly create: {
            readonly summary: "Create client";
            readonly value: {
                readonly name: "ABC Pvt Ltd";
                readonly code: "ABC001";
                readonly email: "contact@abc.com";
                readonly phone: "+91-9876543210";
                readonly address: "123 Business Park, Mumbai, Maharashtra";
                readonly gstNumber: "27AABCU9603R1ZM";
            };
        };
        readonly update: {
            readonly summary: "Update client";
            readonly value: {
                readonly name: "ABC Pvt Ltd (Updated)";
                readonly phone: "+91-9123456780";
                readonly isActive: true;
            };
        };
        readonly listItem: {
            readonly id: 1;
            readonly name: "ABC Pvt Ltd";
            readonly email: "contact@abc.com";
            readonly phone: "+91-9876543210";
            readonly gstNumber: "27AABCU9603R1ZM";
            readonly isActive: true;
            readonly createdAt: "2026-06-13T07:18:47.000Z";
        };
        readonly detail: {
            readonly id: 1;
            readonly name: "ABC Pvt Ltd";
            readonly code: "ABC001";
            readonly email: "contact@abc.com";
            readonly phone: "+91-9876543210";
            readonly address: "123 Business Park, Mumbai, Maharashtra";
            readonly gstNumber: "27AABCU9603R1ZM";
            readonly isActive: true;
            readonly createdAt: "2026-06-13T07:18:47.000Z";
            readonly updatedAt: "2026-06-13T07:18:47.000Z";
        };
        readonly list: readonly [{
            readonly id: 1;
            readonly name: "ABC Pvt Ltd";
            readonly email: "contact@abc.com";
            readonly phone: "+91-9876543210";
            readonly gstNumber: "27AABCU9603R1ZM";
            readonly isActive: true;
            readonly createdAt: "2026-06-13T07:18:47.000Z";
        }];
    };
    readonly engagements: {
        readonly create: {
            readonly summary: "Create engagement";
            readonly value: {
                readonly clientId: 1;
                readonly title: "Financial Audit 2026";
                readonly auditType: "Financial";
                readonly financialYear: "2025-26";
                readonly startDate: "2026-04-01";
                readonly endDate: "2026-06-30";
                readonly status: EngagementStatus.DRAFT;
                readonly description: "Annual statutory financial audit";
            };
        };
        readonly update: {
            readonly summary: "Update engagement";
            readonly value: {
                readonly title: "Financial Audit 2026 (Revised)";
                readonly status: EngagementStatus.IN_PROGRESS;
                readonly description: "Audit fieldwork started";
            };
        };
        readonly listItem: {
            readonly id: 1;
            readonly clientId: 1;
            readonly clientName: "ABC Pvt Ltd";
            readonly title: "Financial Audit 2026";
            readonly auditType: "Financial";
            readonly financialYear: "2025-26";
            readonly status: EngagementStatus.DRAFT;
            readonly startDate: "2026-04-01T00:00:00.000Z";
            readonly endDate: "2026-06-30T00:00:00.000Z";
            readonly createdAt: "2026-06-13T07:18:47.000Z";
        };
        readonly detail: {
            readonly id: 1;
            readonly clientId: 1;
            readonly clientName: "ABC Pvt Ltd";
            readonly title: "Financial Audit 2026";
            readonly auditType: "Financial";
            readonly financialYear: "2025-26";
            readonly status: EngagementStatus.DRAFT;
            readonly startDate: "2026-04-01T00:00:00.000Z";
            readonly endDate: "2026-06-30T00:00:00.000Z";
            readonly description: "Annual statutory financial audit";
            readonly createdAt: "2026-06-13T07:18:47.000Z";
            readonly updatedAt: "2026-06-13T07:18:47.000Z";
        };
        readonly list: readonly [{
            readonly id: 1;
            readonly clientId: 1;
            readonly clientName: "ABC Pvt Ltd";
            readonly title: "Financial Audit 2026";
            readonly auditType: "Financial";
            readonly financialYear: "2025-26";
            readonly status: EngagementStatus.DRAFT;
            readonly startDate: "2026-04-01T00:00:00.000Z";
            readonly endDate: "2026-06-30T00:00:00.000Z";
            readonly createdAt: "2026-06-13T07:18:47.000Z";
        }];
    };
    readonly scopes: {
        readonly create: {
            readonly summary: "Add scope";
            readonly value: {
                readonly name: "Sales";
                readonly description: "Review sales invoices and revenue recognition";
            };
        };
        readonly listItem: {
            readonly id: 1;
            readonly name: "Sales";
            readonly description: "Review sales invoices and revenue recognition";
            readonly isActive: true;
        };
        readonly list: readonly [{
            readonly id: 1;
            readonly name: "Sales";
            readonly description: "Review sales invoices and revenue recognition";
            readonly isActive: true;
        }, {
            readonly id: 2;
            readonly name: "Purchase";
            readonly description: "Review purchase orders and vendor payments";
            readonly isActive: true;
        }];
    };
    readonly requiredDocuments: {
        readonly create: {
            readonly summary: "Add checklist item";
            readonly value: {
                readonly documentName: "Bank Statement";
                readonly isRequired: true;
            };
        };
        readonly updateReceived: {
            readonly summary: "Mark document as received";
            readonly value: {
                readonly isReceived: true;
            };
        };
        readonly listItem: {
            readonly id: 1;
            readonly documentName: "Bank Statement";
            readonly isRequired: true;
            readonly isReceived: false;
        };
        readonly list: readonly [{
            readonly id: 1;
            readonly documentName: "Bank Statement";
            readonly isRequired: true;
            readonly isReceived: false;
        }, {
            readonly id: 2;
            readonly documentName: "GST Return";
            readonly isRequired: true;
            readonly isReceived: true;
        }];
    };
    readonly errors: {
        readonly validation: {
            readonly success: false;
            readonly error: {
                readonly statusCode: 400;
                readonly message: "Validation failed";
                readonly errorCode: "VALIDATION_ERROR";
                readonly validationErrors: readonly ["email must be an email"];
                readonly timestamp: "2026-06-13T07:18:47.000Z";
                readonly path: "/auth/login";
            };
        };
        readonly unauthorized: {
            readonly success: false;
            readonly error: {
                readonly statusCode: 401;
                readonly message: "Invalid credentials";
                readonly errorCode: "UNAUTHORIZED";
                readonly timestamp: "2026-06-13T07:18:47.000Z";
                readonly path: "/auth/login";
            };
        };
        readonly forbidden: {
            readonly success: false;
            readonly error: {
                readonly statusCode: 403;
                readonly message: "Insufficient permissions";
                readonly errorCode: "FORBIDDEN";
                readonly timestamp: "2026-06-13T07:18:47.000Z";
                readonly path: "/users";
            };
        };
        readonly notFound: {
            readonly success: false;
            readonly error: {
                readonly statusCode: 404;
                readonly message: "Client 99 not found";
                readonly errorCode: "NOT_FOUND";
                readonly timestamp: "2026-06-13T07:18:47.000Z";
                readonly path: "/clients/99";
            };
        };
    };
};
