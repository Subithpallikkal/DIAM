"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyDashboardStatsDto = exports.MyIssueItemDto = exports.MyChecklistItemDto = exports.MyTaskItemDto = exports.FindingsReportDto = exports.FindingsReportItemDto = exports.RiskReportDto = exports.RiskReportItemDto = exports.AuditSummaryReportDto = exports.DashboardStatsDto = exports.WorkloadStatsDto = exports.ChecklistWorkloadItemDto = exports.TaskWorkloadItemDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
class TaskWorkloadItemDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { userId: { required: true, type: () => Number }, userName: { required: true, type: () => String }, pending: { required: true, type: () => Number }, inProgress: { required: true, type: () => Number } };
    }
}
exports.TaskWorkloadItemDto = TaskWorkloadItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    __metadata("design:type", Number)
], TaskWorkloadItemDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Demo Auditor" }),
    __metadata("design:type", String)
], TaskWorkloadItemDto.prototype, "userName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2 }),
    __metadata("design:type", Number)
], TaskWorkloadItemDto.prototype, "pending", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], TaskWorkloadItemDto.prototype, "inProgress", void 0);
class ChecklistWorkloadItemDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { userId: { required: true, type: () => Number }, userName: { required: true, type: () => String }, openCount: { required: true, type: () => Number } };
    }
}
exports.ChecklistWorkloadItemDto = ChecklistWorkloadItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    __metadata("design:type", Number)
], ChecklistWorkloadItemDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Demo Auditor" }),
    __metadata("design:type", String)
], ChecklistWorkloadItemDto.prototype, "userName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 4 }),
    __metadata("design:type", Number)
], ChecklistWorkloadItemDto.prototype, "openCount", void 0);
class WorkloadStatsDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { tasksByAssignee: { required: true, type: () => [require("./report.dto").TaskWorkloadItemDto] }, openChecklistsByAssignee: { required: true, type: () => [require("./report.dto").ChecklistWorkloadItemDto] } };
    }
}
exports.WorkloadStatsDto = WorkloadStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [TaskWorkloadItemDto] }),
    __metadata("design:type", Array)
], WorkloadStatsDto.prototype, "tasksByAssignee", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ChecklistWorkloadItemDto] }),
    __metadata("design:type", Array)
], WorkloadStatsDto.prototype, "openChecklistsByAssignee", void 0);
class DashboardStatsDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { totalClients: { required: true, type: () => Number }, totalAudits: { required: true, type: () => Number }, completedAudits: { required: true, type: () => Number }, openRisks: { required: true, type: () => Number }, pendingTasks: { required: true, type: () => Number }, openIssues: { required: true, type: () => Number }, resolvedIssues: { required: true, type: () => Number }, workload: { required: true, type: () => require("./report.dto").WorkloadStatsDto } };
    }
}
exports.DashboardStatsDto = DashboardStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    __metadata("design:type", Number)
], DashboardStatsDto.prototype, "totalClients", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 8 }),
    __metadata("design:type", Number)
], DashboardStatsDto.prototype, "totalAudits", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2 }),
    __metadata("design:type", Number)
], DashboardStatsDto.prototype, "completedAudits", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12 }),
    __metadata("design:type", Number)
], DashboardStatsDto.prototype, "openRisks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 4 }),
    __metadata("design:type", Number)
], DashboardStatsDto.prototype, "pendingTasks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    __metadata("design:type", Number)
], DashboardStatsDto.prototype, "openIssues", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 7 }),
    __metadata("design:type", Number)
], DashboardStatsDto.prototype, "resolvedIssues", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: WorkloadStatsDto }),
    __metadata("design:type", WorkloadStatsDto)
], DashboardStatsDto.prototype, "workload", void 0);
class AuditSummaryReportDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { engagementTitle: { required: true, type: () => String }, clientName: { required: true, type: () => String }, totalRisks: { required: true, type: () => Number }, openIssues: { required: true, type: () => Number }, resolvedIssues: { required: true, type: () => Number }, pendingTasks: { required: true, type: () => Number }, completedTasks: { required: true, type: () => Number }, totalDocuments: { required: true, type: () => Number } };
    }
}
exports.AuditSummaryReportDto = AuditSummaryReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Financial Audit 2026" }),
    __metadata("design:type", String)
], AuditSummaryReportDto.prototype, "engagementTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "ABC Pvt Ltd" }),
    __metadata("design:type", String)
], AuditSummaryReportDto.prototype, "clientName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12 }),
    __metadata("design:type", Number)
], AuditSummaryReportDto.prototype, "totalRisks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    __metadata("design:type", Number)
], AuditSummaryReportDto.prototype, "openIssues", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 7 }),
    __metadata("design:type", Number)
], AuditSummaryReportDto.prototype, "resolvedIssues", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    __metadata("design:type", Number)
], AuditSummaryReportDto.prototype, "pendingTasks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2 }),
    __metadata("design:type", Number)
], AuditSummaryReportDto.prototype, "completedTasks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    __metadata("design:type", Number)
], AuditSummaryReportDto.prototype, "totalDocuments", void 0);
class RiskReportItemDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String }, priority: { required: true, type: () => String }, status: { required: true, type: () => String }, checklistProgress: { required: true, type: () => String } };
    }
}
exports.RiskReportItemDto = RiskReportItemDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RiskReportItemDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RiskReportItemDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RiskReportItemDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RiskReportItemDto.prototype, "checklistProgress", void 0);
class RiskReportDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { engagementTitle: { required: true, type: () => String }, high: { required: true, type: () => Number }, medium: { required: true, type: () => Number }, low: { required: true, type: () => Number }, items: { required: true, type: () => [require("./report.dto").RiskReportItemDto] } };
    }
}
exports.RiskReportDto = RiskReportDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RiskReportDto.prototype, "engagementTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 4 }),
    __metadata("design:type", Number)
], RiskReportDto.prototype, "high", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    __metadata("design:type", Number)
], RiskReportDto.prototype, "medium", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    __metadata("design:type", Number)
], RiskReportDto.prototype, "low", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [RiskReportItemDto] }),
    __metadata("design:type", Array)
], RiskReportDto.prototype, "items", void 0);
class FindingsReportItemDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { issueName: { required: true, type: () => String }, findingTitle: { required: true, type: () => String }, severity: { required: true, type: () => String }, status: { required: true, type: () => String } };
    }
}
exports.FindingsReportItemDto = FindingsReportItemDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], FindingsReportItemDto.prototype, "issueName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], FindingsReportItemDto.prototype, "findingTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], FindingsReportItemDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], FindingsReportItemDto.prototype, "status", void 0);
class FindingsReportDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { engagementTitle: { required: true, type: () => String }, items: { required: true, type: () => [require("./report.dto").FindingsReportItemDto] } };
    }
}
exports.FindingsReportDto = FindingsReportDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], FindingsReportDto.prototype, "engagementTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [FindingsReportItemDto] }),
    __metadata("design:type", Array)
], FindingsReportDto.prototype, "items", void 0);
class MyTaskItemDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, title: { required: true, type: () => String }, engagementTitle: { required: true, type: () => String }, status: { required: true, type: () => String } };
    }
}
exports.MyTaskItemDto = MyTaskItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], MyTaskItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Review bank statements" }),
    __metadata("design:type", String)
], MyTaskItemDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Financial Audit 2026" }),
    __metadata("design:type", String)
], MyTaskItemDto.prototype, "engagementTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "PENDING" }),
    __metadata("design:type", String)
], MyTaskItemDto.prototype, "status", void 0);
class MyChecklistItemDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, title: { required: true, type: () => String }, riskId: { required: true, type: () => Number }, riskTitle: { required: true, type: () => String }, engagementTitle: { required: true, type: () => String } };
    }
}
exports.MyChecklistItemDto = MyChecklistItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], MyChecklistItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Verify GST returns" }),
    __metadata("design:type", String)
], MyChecklistItemDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    __metadata("design:type", Number)
], MyChecklistItemDto.prototype, "riskId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Tax compliance risk" }),
    __metadata("design:type", String)
], MyChecklistItemDto.prototype, "riskTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Financial Audit 2026" }),
    __metadata("design:type", String)
], MyChecklistItemDto.prototype, "engagementTitle", void 0);
class MyIssueItemDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, title: { required: true, type: () => String }, engagementTitle: { required: true, type: () => String }, status: { required: true, type: () => String }, severity: { required: true, type: () => String } };
    }
}
exports.MyIssueItemDto = MyIssueItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], MyIssueItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "GST filing delayed" }),
    __metadata("design:type", String)
], MyIssueItemDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Financial Audit 2026" }),
    __metadata("design:type", String)
], MyIssueItemDto.prototype, "engagementTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "OPEN" }),
    __metadata("design:type", String)
], MyIssueItemDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "HIGH" }),
    __metadata("design:type", String)
], MyIssueItemDto.prototype, "severity", void 0);
class MyDashboardStatsDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { pendingTasks: { required: true, type: () => Number }, inProgressTasks: { required: true, type: () => Number }, openChecklists: { required: true, type: () => Number }, openIssues: { required: true, type: () => Number }, myTasks: { required: true, type: () => [require("./report.dto").MyTaskItemDto] }, myChecklists: { required: true, type: () => [require("./report.dto").MyChecklistItemDto] }, myIssues: { required: true, type: () => [require("./report.dto").MyIssueItemDto] } };
    }
}
exports.MyDashboardStatsDto = MyDashboardStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2 }),
    __metadata("design:type", Number)
], MyDashboardStatsDto.prototype, "pendingTasks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], MyDashboardStatsDto.prototype, "inProgressTasks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    __metadata("design:type", Number)
], MyDashboardStatsDto.prototype, "openChecklists", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2 }),
    __metadata("design:type", Number)
], MyDashboardStatsDto.prototype, "openIssues", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [MyTaskItemDto] }),
    __metadata("design:type", Array)
], MyDashboardStatsDto.prototype, "myTasks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [MyChecklistItemDto] }),
    __metadata("design:type", Array)
], MyDashboardStatsDto.prototype, "myChecklists", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [MyIssueItemDto] }),
    __metadata("design:type", Array)
], MyDashboardStatsDto.prototype, "myIssues", void 0);
//# sourceMappingURL=report.dto.js.map