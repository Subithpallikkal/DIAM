import { EngagementStatus } from "../../dtos/common/engagement.dto";
import { RoleName } from "../../dtos/common/role.dto";
import { IssueStatus, Priority, RiskStatus, TaskStatus } from "../../dtos/common/enums.dto";
export declare const SwaggerExamples: {
    readonly auth: {
        readonly loginAdmin: {
            readonly summary: "Admin login";
            readonly value: {
                readonly email: "admin@gmail.com";
                readonly password: "Admin@123";
            };
        };
        readonly loginManager: {
            readonly summary: "Manager login";
            readonly value: {
                readonly email: "manager@gmail.com";
                readonly password: "Manager@123";
            };
        };
        readonly loginAuditor: {
            readonly summary: "Auditor login";
            readonly value: {
                readonly email: "auditor@gmail.com";
                readonly password: "Auditor@123";
            };
        };
        readonly loginResponse: {
            readonly accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.sample.token";
            readonly user: {
                readonly uid: 1;
                readonly name: "Admin";
                readonly email: "admin@gmail.com";
                readonly role: RoleName.ADMIN;
            };
        };
        readonly meResponse: {
            readonly uid: 1;
            readonly name: "Admin";
            readonly email: "admin@gmail.com";
            readonly role: RoleName.ADMIN;
        };
    };
    readonly users: {
        readonly create: {
            readonly summary: "Create user";
            readonly value: {
                readonly name: "Priya Sharma";
                readonly email: "priya.auditor@test.com";
                readonly password: "Auditor@123";
                readonly role: RoleName.AUDITOR;
            };
        };
        readonly update: {
            readonly summary: "Update user";
            readonly value: {
                readonly id: 4;
                readonly name: "Priya Sharma";
                readonly role: RoleName.AUDITOR;
                readonly isActive: true;
            };
        };
        readonly listItem: {
            readonly id: 3;
            readonly name: "Auditor";
            readonly email: "auditor@gmail.com";
            readonly role: RoleName.AUDITOR;
            readonly isActive: true;
            readonly createdAt: "2026-06-19T10:00:00.000Z";
        };
        readonly detail: {
            readonly id: 3;
            readonly name: "Auditor";
            readonly email: "auditor@gmail.com";
            readonly role: RoleName.AUDITOR;
            readonly isActive: true;
            readonly createdAt: "2026-06-19T10:00:00.000Z";
            readonly updatedAt: "2026-06-19T10:00:00.000Z";
        };
        readonly paginated: {
            data: {
                id: number;
                name: string;
                email: string;
                role: RoleName;
                isActive: boolean;
                createdAt: string;
            }[];
            meta: {
                page: number;
                limit: number;
                total: number;
                totalPages: number;
            };
        };
    };
    readonly clients: {
        readonly create: {
            readonly summary: "Create client";
            readonly value: {
                readonly name: "Acme Industries Ltd";
                readonly code: "CL-001";
                readonly email: "finance@acme-test.com";
                readonly phone: "+91 98765 43210";
                readonly address: "42 Industrial Estate, Mumbai 400001";
                readonly gstNumber: "27AABCA1234A1Z5";
            };
        };
        readonly update: {
            readonly summary: "Update client";
            readonly value: {
                readonly id: 1;
                readonly name: "Acme Industries Ltd";
                readonly phone: "+91 91234 56780";
                readonly isActive: true;
            };
        };
        readonly listItem: {
            readonly id: 1;
            readonly name: "Acme Industries Ltd";
            readonly email: "finance@acme-test.com";
            readonly phone: "+91 98765 43210";
            readonly gstNumber: "27AABCA1234A1Z5";
            readonly isActive: true;
            readonly createdAt: "2026-06-19T10:00:00.000Z";
        };
        readonly detail: {
            readonly id: 1;
            readonly name: "Acme Industries Ltd";
            readonly code: "CL-001";
            readonly email: "finance@acme-test.com";
            readonly phone: "+91 98765 43210";
            readonly address: "42 Industrial Estate, Mumbai 400001";
            readonly gstNumber: "27AABCA1234A1Z5";
            readonly isActive: true;
            readonly createdAt: "2026-06-19T10:00:00.000Z";
            readonly updatedAt: "2026-06-19T10:00:00.000Z";
        };
        readonly paginated: {
            data: {
                id: number;
                name: string;
                email: string;
                phone: string;
                gstNumber: string;
                isActive: boolean;
                createdAt: string;
            }[];
            meta: {
                page: number;
                limit: number;
                total: number;
                totalPages: number;
            };
        };
    };
    readonly engagements: {
        readonly create: {
            readonly summary: "Create engagement";
            readonly value: {
                readonly clientId: 1;
                readonly title: "FY 2025 Internal Audit — Acme";
                readonly auditType: "Internal";
                readonly financialYear: "2024-25";
                readonly startDate: "2025-01-15";
                readonly endDate: "2025-06-30";
                readonly status: EngagementStatus.IN_PROGRESS;
                readonly description: "Annual internal audit covering revenue, procurement, and payroll";
            };
        };
        readonly update: {
            readonly summary: "Update engagement";
            readonly value: {
                readonly id: 1;
                readonly title: "FY 2025 Internal Audit — Acme (Revised)";
                readonly status: EngagementStatus.IN_PROGRESS;
                readonly description: "Fieldwork started";
            };
        };
        readonly listItem: {
            readonly id: 1;
            readonly clientId: 1;
            readonly clientName: "Acme Industries Ltd";
            readonly title: "FY 2025 Internal Audit — Acme";
            readonly auditType: "Internal";
            readonly financialYear: "2024-25";
            readonly status: EngagementStatus.IN_PROGRESS;
            readonly startDate: "2025-01-15T00:00:00.000Z";
            readonly endDate: "2025-06-30T00:00:00.000Z";
            readonly createdAt: "2026-06-19T10:00:00.000Z";
        };
        readonly detail: {
            readonly id: 1;
            readonly clientId: 1;
            readonly clientName: "Acme Industries Ltd";
            readonly title: "FY 2025 Internal Audit — Acme";
            readonly auditType: "Internal";
            readonly financialYear: "2024-25";
            readonly status: EngagementStatus.IN_PROGRESS;
            readonly startDate: "2025-01-15T00:00:00.000Z";
            readonly endDate: "2025-06-30T00:00:00.000Z";
            readonly description: "Annual internal audit covering revenue, procurement, and payroll";
            readonly createdAt: "2026-06-19T10:00:00.000Z";
            readonly updatedAt: "2026-06-19T10:00:00.000Z";
        };
        readonly paginated: {
            data: {
                id: number;
                clientId: number;
                clientName: string;
                title: string;
                auditType: string;
                financialYear: string;
                status: EngagementStatus;
                startDate: string;
                endDate: string;
                createdAt: string;
            }[];
            meta: {
                page: number;
                limit: number;
                total: number;
                totalPages: number;
            };
        };
    };
    readonly scopes: {
        readonly create: {
            readonly summary: "Add scope";
            readonly value: {
                readonly name: "Revenue & Receivables";
                readonly description: "Sales cutoff, credit notes, deferred revenue";
            };
        };
        readonly listItem: {
            readonly id: 1;
            readonly name: "Revenue & Receivables";
            readonly description: "Sales cutoff, credit notes, deferred revenue";
            readonly isActive: true;
        };
        readonly list: readonly [{
            readonly id: 1;
            readonly name: "Revenue & Receivables";
            readonly description: "Sales cutoff, credit notes, deferred revenue";
            readonly isActive: true;
        }, {
            readonly id: 2;
            readonly name: "Procurement & Payables";
            readonly description: "PO approval, three-way match, vendor master";
            readonly isActive: true;
        }];
    };
    readonly requiredDocuments: {
        readonly create: {
            readonly summary: "Add checklist item";
            readonly value: {
                readonly documentName: "Trial Balance";
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
            readonly documentName: "Trial Balance";
            readonly isRequired: true;
            readonly isReceived: true;
        };
        readonly list: readonly [{
            readonly id: 1;
            readonly documentName: "Trial Balance";
            readonly isRequired: true;
            readonly isReceived: true;
        }, {
            readonly id: 2;
            readonly documentName: "Bank Statements (12 months)";
            readonly isRequired: true;
            readonly isReceived: false;
        }];
    };
    readonly issues: {
        readonly create: {
            readonly summary: "Create issue";
            readonly value: {
                readonly title: "Unrecorded sales invoices in December";
                readonly description: "Q4 invoices not posted to ERP before year-end";
                readonly severity: Priority.HIGH;
                readonly responsiblePerson: "CFO — Acme Industries";
            };
        };
        readonly update: {
            readonly summary: "Update issue";
            readonly value: {
                readonly id: 1;
                readonly status: IssueStatus.IN_PROGRESS;
                readonly severity: Priority.HIGH;
            };
        };
        readonly assign: {
            readonly summary: "Assign to auditor";
            readonly value: {
                readonly assignedToId: 3;
            };
        };
        readonly assignClient: {
            readonly summary: "Assign to client";
            readonly value: {
                readonly clientId: 1;
            };
        };
        readonly finding: {
            readonly summary: "Add finding";
            readonly value: {
                readonly title: "₹12.4L revenue not recorded in ERP";
                readonly description: "Invoices dated 28–31 Dec posted in January";
                readonly severity: Priority.HIGH;
            };
        };
        readonly listItem: {
            readonly id: 1;
            readonly engagementId: 1;
            readonly engagementTitle: "FY 2025 Internal Audit — Acme";
            readonly title: "Unrecorded sales invoices in December";
            readonly severity: Priority.HIGH;
            readonly status: IssueStatus.IN_PROGRESS;
            readonly responsiblePerson: "CFO — Acme Industries";
            readonly assignedClientName: "Acme Industries Ltd";
            readonly findingsCount: 1;
            readonly createdAt: "2026-06-19T10:00:00.000Z";
        };
        readonly detail: {
            readonly id: 1;
            readonly engagementId: 1;
            readonly engagementTitle: "FY 2025 Internal Audit — Acme";
            readonly title: "Unrecorded sales invoices in December";
            readonly severity: Priority.HIGH;
            readonly status: IssueStatus.IN_PROGRESS;
            readonly responsiblePerson: "CFO — Acme Industries";
            readonly assignedClientName: "Acme Industries Ltd";
            readonly findingsCount: 1;
            readonly createdAt: "2026-06-19T10:00:00.000Z";
            readonly description: "Q4 invoices not posted to ERP before year-end";
            readonly assigneeName: "Auditor";
            readonly assignedClientId: 1;
            readonly findings: readonly [{
                readonly id: 1;
                readonly title: "₹12.4L revenue not recorded in ERP";
                readonly description: "Invoices dated 28–31 Dec posted in January";
                readonly severity: Priority.HIGH;
                readonly createdByName: "Auditor";
                readonly createdAt: "2026-06-19T10:00:00.000Z";
            }];
            readonly statusLogs: readonly [{
                readonly id: 1;
                readonly oldStatus: IssueStatus.OPEN;
                readonly newStatus: IssueStatus.IN_PROGRESS;
                readonly changedByName: "Manager";
                readonly createdAt: "2026-06-19T10:00:00.000Z";
            }];
            readonly updatedAt: "2026-06-19T10:00:00.000Z";
        };
        readonly findingItem: {
            readonly id: 1;
            readonly title: "₹12.4L revenue not recorded in ERP";
            readonly description: "Invoices dated 28–31 Dec posted in January";
            readonly severity: Priority.HIGH;
            readonly createdByName: "Auditor";
            readonly createdAt: "2026-06-19T10:00:00.000Z";
        };
        readonly paginated: {
            data: {
                id: number;
                engagementId: number;
                engagementTitle: string;
                title: string;
                severity: Priority;
                status: IssueStatus;
                responsiblePerson: string;
                assignedClientName: string;
                findingsCount: number;
                createdAt: string;
            }[];
            meta: {
                page: number;
                limit: number;
                total: number;
                totalPages: number;
            };
        };
    };
    readonly tasks: {
        readonly create: {
            readonly summary: "Create task";
            readonly value: {
                readonly title: "Perform revenue substantive testing";
                readonly description: "Sample 25 invoices across Q3 and Q4";
                readonly status: TaskStatus.PENDING;
            };
        };
        readonly update: {
            readonly summary: "Update task";
            readonly value: {
                readonly id: 1;
                readonly status: TaskStatus.IN_PROGRESS;
            };
        };
        readonly assign: {
            readonly summary: "Assign to auditor";
            readonly value: {
                readonly assignedToId: 3;
            };
        };
        readonly comment: {
            readonly summary: "Add comment";
            readonly value: {
                readonly content: "Started reviewing Q4 sales invoices";
            };
        };
        readonly listItem: {
            readonly id: 1;
            readonly engagementId: 1;
            readonly engagementTitle: "FY 2025 Internal Audit — Acme";
            readonly title: "Perform revenue substantive testing";
            readonly description: "Sample 25 invoices across Q3 and Q4";
            readonly status: TaskStatus.IN_PROGRESS;
            readonly assigneeName: "Auditor";
            readonly createdAt: "2026-06-19T10:00:00.000Z";
        };
        readonly detail: {
            readonly id: 1;
            readonly engagementId: 1;
            readonly engagementTitle: "FY 2025 Internal Audit — Acme";
            readonly title: "Perform revenue substantive testing";
            readonly description: "Sample 25 invoices across Q3 and Q4";
            readonly status: TaskStatus.IN_PROGRESS;
            readonly assigneeName: "Auditor";
            readonly createdAt: "2026-06-19T10:00:00.000Z";
            readonly comments: readonly [{
                readonly id: 1;
                readonly authorName: "Auditor";
                readonly content: "Started reviewing Q4 sales invoices";
                readonly createdAt: "2026-06-19T10:00:00.000Z";
            }];
            readonly updatedAt: "2026-06-19T10:00:00.000Z";
        };
        readonly paginated: {
            data: ({
                id: number;
                engagementId: number;
                engagementTitle: string;
                title: string;
                description: string;
                status: TaskStatus;
                assigneeName: string;
                createdAt: string;
            } | {
                id: number;
                engagementId: number;
                engagementTitle: string;
                title: string;
                description: null;
                status: TaskStatus;
                assigneeName: string;
                createdAt: string;
            })[];
            meta: {
                page: number;
                limit: number;
                total: number;
                totalPages: number;
            };
        };
    };
    readonly risks: {
        readonly create: {
            readonly summary: "Create risk";
            readonly value: {
                readonly title: "Revenue recognition cutoff errors";
                readonly description: "Q4 sales may be recorded in wrong period";
                readonly priority: Priority.HIGH;
                readonly status: RiskStatus.OPEN;
            };
        };
        readonly update: {
            readonly summary: "Update risk";
            readonly value: {
                readonly id: 1;
                readonly status: RiskStatus.OPEN;
                readonly priority: Priority.HIGH;
            };
        };
        readonly checklistCreate: {
            readonly summary: "Add checklist item";
            readonly value: {
                readonly title: "Review Q4 sales invoices";
                readonly sortOrder: 0;
            };
        };
        readonly checklistUpdate: {
            readonly summary: "Mark checklist complete";
            readonly value: {
                readonly id: 1;
                readonly isCompleted: true;
            };
        };
        readonly assignChecklist: {
            readonly summary: "Assign checklist";
            readonly value: {
                readonly assignedToId: 3;
            };
        };
        readonly listItem: {
            readonly id: 1;
            readonly engagementId: 1;
            readonly title: "Revenue recognition cutoff errors";
            readonly description: "Q4 sales may be recorded in wrong period";
            readonly priority: Priority.HIGH;
            readonly status: RiskStatus.OPEN;
            readonly checklistCount: 3;
            readonly completedChecklistCount: 1;
            readonly createdAt: "2026-06-19T10:00:00.000Z";
        };
        readonly checklistItem: {
            readonly id: 1;
            readonly title: "Review Q4 sales invoices";
            readonly isCompleted: false;
            readonly sortOrder: 0;
            readonly assigneeName: "Auditor";
        };
        readonly checklistList: readonly [{
            readonly id: 1;
            readonly title: "Review Q4 sales invoices";
            readonly isCompleted: false;
            readonly sortOrder: 0;
            readonly assigneeName: "Auditor";
        }, {
            readonly id: 2;
            readonly title: "Test cutoff journal entries";
            readonly isCompleted: true;
            readonly sortOrder: 1;
            readonly assigneeName: "Auditor";
        }];
        readonly paginated: {
            data: {
                id: number;
                engagementId: number;
                title: string;
                description: string;
                priority: Priority;
                status: RiskStatus;
                checklistCount: number;
                completedChecklistCount: number;
                createdAt: string;
            }[];
            meta: {
                page: number;
                limit: number;
                total: number;
                totalPages: number;
            };
        };
    };
    readonly documents: {
        readonly categoryCreate: {
            readonly summary: "Create category";
            readonly value: {
                readonly name: "Financial";
                readonly description: "Financial statements and records";
            };
        };
        readonly category: {
            readonly id: 1;
            readonly name: "Financial";
            readonly description: "Financial statements and records";
            readonly createdAt: "2026-06-19T10:00:00.000Z";
        };
        readonly categories: readonly [{
            readonly id: 1;
            readonly name: "Financial";
            readonly description: "Financial statements and records";
            readonly createdAt: "2026-06-19T10:00:00.000Z";
        }, {
            readonly id: 2;
            readonly name: "Tax";
            readonly description: "GST and tax related documents";
            readonly createdAt: "2026-06-19T10:00:00.000Z";
        }];
        readonly listItem: {
            readonly id: 1;
            readonly clientId: 1;
            readonly clientName: "Acme Industries Ltd";
            readonly engagementId: 1;
            readonly engagementTitle: "FY 2025 Internal Audit — Acme";
            readonly categoryId: 1;
            readonly categoryName: "Financial";
            readonly originalName: "Acme_Trial_Balance_FY25.xlsx";
            readonly mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            readonly fileSize: 245760;
            readonly uploadedByName: "Manager";
            readonly version: 1;
            readonly parentDocumentId: null;
            readonly rootDocumentId: 1;
            readonly versionCount: 1;
            readonly createdAt: "2026-06-19T10:00:00.000Z";
        };
        readonly log: {
            readonly id: 1;
            readonly action: "UPLOAD";
            readonly performedByName: "Manager";
            readonly details: "Initial upload";
            readonly createdAt: "2026-06-19T10:00:00.000Z";
        };
        readonly logs: readonly [{
            readonly id: 1;
            readonly action: "UPLOAD";
            readonly performedByName: "Manager";
            readonly details: "Initial upload";
            readonly createdAt: "2026-06-19T10:00:00.000Z";
        }, {
            readonly id: 2;
            readonly action: "DOWNLOAD";
            readonly performedByName: "Auditor";
            readonly details: null;
            readonly createdAt: "2026-06-19T10:00:00.000Z";
        }];
        readonly paginated: {
            data: {
                id: number;
                clientId: number;
                clientName: string;
                engagementId: number;
                engagementTitle: string;
                categoryId: number;
                categoryName: string;
                originalName: string;
                mimeType: string;
                fileSize: number;
                uploadedByName: string;
                version: number;
                parentDocumentId: null;
                rootDocumentId: number;
                versionCount: number;
                createdAt: string;
            }[];
            meta: {
                page: number;
                limit: number;
                total: number;
                totalPages: number;
            };
        };
    };
    readonly reports: {
        readonly dashboard: {
            readonly totalClients: 5;
            readonly totalAudits: 6;
            readonly completedAudits: 2;
            readonly openRisks: 4;
            readonly pendingTasks: 6;
            readonly openIssues: 4;
            readonly resolvedIssues: 3;
            readonly workload: {
                readonly tasksByAssignee: readonly [{
                    readonly userId: 3;
                    readonly userName: "Auditor";
                    readonly pending: 3;
                    readonly inProgress: 2;
                }];
                readonly openChecklistsByAssignee: readonly [{
                    readonly userId: 3;
                    readonly userName: "Auditor";
                    readonly openCount: 4;
                }];
            };
        };
        readonly myDashboard: {
            readonly pendingTasks: 2;
            readonly inProgressTasks: 1;
            readonly openChecklists: 3;
            readonly openIssues: 2;
            readonly myTasks: readonly [{
                readonly id: 1;
                readonly title: "Perform revenue substantive testing";
                readonly engagementTitle: "FY 2025 Internal Audit — Acme";
                readonly status: TaskStatus.IN_PROGRESS;
            }];
            readonly myChecklists: readonly [{
                readonly id: 1;
                readonly title: "Review Q4 sales invoices";
                readonly riskId: 1;
                readonly riskTitle: "Revenue recognition cutoff errors";
                readonly engagementTitle: "FY 2025 Internal Audit — Acme";
            }];
            readonly myIssues: readonly [{
                readonly id: 1;
                readonly title: "Unrecorded sales invoices in December";
                readonly engagementTitle: "FY 2025 Internal Audit — Acme";
                readonly status: IssueStatus.IN_PROGRESS;
                readonly severity: Priority.HIGH;
            }];
        };
        readonly auditSummary: {
            readonly engagementTitle: "FY 2025 Internal Audit — Acme";
            readonly clientName: "Acme Industries Ltd";
            readonly totalRisks: 2;
            readonly openIssues: 2;
            readonly resolvedIssues: 0;
            readonly pendingTasks: 2;
            readonly completedTasks: 1;
            readonly totalDocuments: 2;
        };
        readonly riskReport: {
            readonly engagementTitle: "FY 2025 Internal Audit — Acme";
            readonly high: 1;
            readonly medium: 1;
            readonly low: 0;
            readonly items: readonly [{
                readonly title: "Revenue recognition cutoff errors";
                readonly priority: Priority.HIGH;
                readonly status: RiskStatus.OPEN;
                readonly checklistProgress: "1/3";
            }, {
                readonly title: "Weak segregation in procurement";
                readonly priority: Priority.MEDIUM;
                readonly status: RiskStatus.OPEN;
                readonly checklistProgress: "0/2";
            }];
        };
        readonly findingsReport: {
            readonly engagementTitle: "FY 2025 Internal Audit — Acme";
            readonly items: readonly [{
                readonly issueName: "Unrecorded sales invoices in December";
                readonly findingTitle: "₹12.4L revenue not recorded in ERP";
                readonly severity: Priority.HIGH;
                readonly status: IssueStatus.IN_PROGRESS;
            }];
        };
    };
    readonly roles: {
        readonly list: readonly [{
            readonly id: 1;
            readonly name: RoleName.ADMIN;
            readonly description: "Full system access";
            readonly permissions: readonly ["Create, update, and deactivate users", "Manage all modules"];
        }, {
            readonly id: 2;
            readonly name: RoleName.MANAGER;
            readonly description: "Manage clients and audit engagements";
            readonly permissions: readonly ["Manage clients and engagements", "Assign tasks and issues"];
        }, {
            readonly id: 3;
            readonly name: RoleName.AUDITOR;
            readonly description: "Execute audit work and review documents";
            readonly permissions: readonly ["View assigned work", "Update tasks and checklists"];
        }];
        readonly permissionGrid: {
            readonly roleId: 2;
            readonly role: RoleName.MANAGER;
            readonly description: "Manage clients and audit engagements";
            readonly groups: readonly [{
                readonly key: "audit";
                readonly label: "Audit modules";
                readonly resources: readonly [{
                    readonly key: "clients";
                    readonly label: "Clients";
                    readonly permissions: {
                        readonly create: true;
                        readonly editOwn: true;
                        readonly editAny: true;
                        readonly deleteOwn: false;
                        readonly deleteAny: false;
                    };
                }];
            }];
        };
        readonly updatePermissions: {
            readonly summary: "Update permissions";
            readonly value: {
                readonly permissions: {
                    readonly clients: {
                        readonly create: true;
                        readonly editOwn: true;
                        readonly editAny: true;
                        readonly deleteOwn: false;
                        readonly deleteAny: false;
                    };
                };
            };
        };
    };
    readonly errors: {
        readonly validation: {
            readonly success: false;
            readonly error: {
                readonly statusCode: 400;
                readonly message: "Validation failed";
                readonly errorCode: "VALIDATION_ERROR";
                readonly validationErrors: readonly ["email must be an email"];
                readonly timestamp: "2026-06-19T10:00:00.000Z";
                readonly path: "/auth/login";
            };
        };
        readonly unauthorized: {
            readonly success: false;
            readonly error: {
                readonly statusCode: 401;
                readonly message: "Invalid credentials";
                readonly errorCode: "UNAUTHORIZED";
                readonly timestamp: "2026-06-19T10:00:00.000Z";
                readonly path: "/auth/login";
            };
        };
        readonly forbidden: {
            readonly success: false;
            readonly error: {
                readonly statusCode: 403;
                readonly message: "Insufficient permissions";
                readonly errorCode: "FORBIDDEN";
                readonly timestamp: "2026-06-19T10:00:00.000Z";
                readonly path: "/users";
            };
        };
        readonly notFound: {
            readonly success: false;
            readonly error: {
                readonly statusCode: 404;
                readonly message: "Client 99 not found";
                readonly errorCode: "NOT_FOUND";
                readonly timestamp: "2026-06-19T10:00:00.000Z";
                readonly path: "/clients/99";
            };
        };
    };
};
