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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reports_service_1 = require("../../services/reports/reports.service");
const report_export_service_1 = require("../../services/reports/report-export.service");
const report_dto_1 = require("../../dtos/reports/report.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_constants_1 = require("../../common/constants/roles.constants");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const api_examples_1 = require("../../common/swagger/api-examples");
let ReportsController = class ReportsController {
    constructor(reportsService, exportService) {
        this.reportsService = reportsService;
        this.exportService = exportService;
    }
    getDashboardStats() {
        return this.reportsService.getDashboardStats();
    }
    getMyDashboardStats(user) {
        return this.reportsService.getMyDashboardStats(user.sub);
    }
    getAuditSummary(engagementId) {
        return this.reportsService.getAuditSummary(Number(engagementId));
    }
    getRiskReport(engagementId) {
        return this.reportsService.getRiskReport(Number(engagementId));
    }
    getFindingsReport(engagementId) {
        return this.reportsService.getFindingsReport(Number(engagementId));
    }
    async exportAuditSummary(engagementId, format, res) {
        const id = Number(engagementId);
        const buffer = format === "excel"
            ? await this.exportService.exportAuditSummaryExcel(id)
            : await this.exportService.exportAuditSummaryPdf(id);
        const contentType = format === "excel"
            ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            : "application/pdf";
        const extension = format === "excel" ? "xlsx" : "pdf";
        res.set({
            "Content-Type": contentType,
            "Content-Disposition": `attachment; filename="audit-summary.${extension}"`,
        });
        return new common_1.StreamableFile(buffer);
    }
    async exportRiskReport(engagementId, format, res) {
        const id = Number(engagementId);
        const buffer = format === "excel"
            ? await this.exportService.exportRiskReportExcel(id)
            : await this.exportService.exportRiskReportPdf(id);
        const contentType = format === "excel"
            ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            : "application/pdf";
        const extension = format === "excel" ? "xlsx" : "pdf";
        res.set({
            "Content-Type": contentType,
            "Content-Disposition": `attachment; filename="risk-report.${extension}"`,
        });
        return new common_1.StreamableFile(buffer);
    }
    async exportFindingsReport(engagementId, format, res) {
        const id = Number(engagementId);
        const buffer = format === "excel"
            ? await this.exportService.exportFindingsReportExcel(id)
            : await this.exportService.exportFindingsReportPdf(id);
        const contentType = format === "excel"
            ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            : "application/pdf";
        const extension = format === "excel" ? "xlsx" : "pdf";
        res.set({
            "Content-Type": contentType,
            "Content-Disposition": `attachment; filename="findings-report.${extension}"`,
        });
        return new common_1.StreamableFile(buffer);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ALL),
    (0, common_1.Get)("dashboard"),
    (0, swagger_1.ApiOperation)({ summary: "Get dashboard statistics" }),
    (0, swagger_1.ApiOkResponse)({
        type: report_dto_1.DashboardStatsDto,
        schema: { example: api_examples_1.SwaggerExamples.reports.dashboard },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getDashboardStats", null);
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ALL),
    (0, common_1.Get)("my-dashboard"),
    (0, swagger_1.ApiOperation)({ summary: "Get personal dashboard for current user" }),
    (0, swagger_1.ApiOkResponse)({
        type: report_dto_1.MyDashboardStatsDto,
        schema: { example: api_examples_1.SwaggerExamples.reports.myDashboard },
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getMyDashboardStats", null);
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ALL),
    (0, common_1.Get)("audit-summary"),
    (0, swagger_1.ApiOperation)({ summary: "Get audit summary report" }),
    (0, swagger_1.ApiQuery)({ name: "engagementId", type: Number, required: true }),
    (0, swagger_1.ApiOkResponse)({
        type: report_dto_1.AuditSummaryReportDto,
        schema: { example: api_examples_1.SwaggerExamples.reports.auditSummary },
    }),
    __param(0, (0, common_1.Query)("engagementId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getAuditSummary", null);
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ALL),
    (0, common_1.Get)("risk-report"),
    (0, swagger_1.ApiOperation)({ summary: "Get risk report" }),
    (0, swagger_1.ApiQuery)({ name: "engagementId", type: Number, required: true }),
    (0, swagger_1.ApiOkResponse)({
        type: report_dto_1.RiskReportDto,
        schema: { example: api_examples_1.SwaggerExamples.reports.riskReport },
    }),
    __param(0, (0, common_1.Query)("engagementId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getRiskReport", null);
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ALL),
    (0, common_1.Get)("findings-report"),
    (0, swagger_1.ApiOperation)({ summary: "Get findings report" }),
    (0, swagger_1.ApiQuery)({ name: "engagementId", type: Number, required: true }),
    (0, swagger_1.ApiOkResponse)({
        type: report_dto_1.FindingsReportDto,
        schema: { example: api_examples_1.SwaggerExamples.reports.findingsReport },
    }),
    __param(0, (0, common_1.Query)("engagementId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getFindingsReport", null);
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ALL),
    (0, common_1.Get)("audit-summary/export"),
    (0, swagger_1.ApiOperation)({ summary: "Export audit summary as PDF or Excel" }),
    (0, swagger_1.ApiQuery)({ name: "engagementId", type: Number, required: true }),
    (0, swagger_1.ApiQuery)({ name: "format", enum: ["pdf", "excel"], required: true }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)("engagementId")),
    __param(1, (0, common_1.Query)("format")),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "exportAuditSummary", null);
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ALL),
    (0, common_1.Get)("risk-report/export"),
    (0, swagger_1.ApiOperation)({ summary: "Export risk report as PDF or Excel" }),
    (0, swagger_1.ApiQuery)({ name: "engagementId", type: Number, required: true }),
    (0, swagger_1.ApiQuery)({ name: "format", enum: ["pdf", "excel"], required: true }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)("engagementId")),
    __param(1, (0, common_1.Query)("format")),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "exportRiskReport", null);
__decorate([
    (0, roles_decorator_1.RequireRoles)(...roles_constants_1.Roles.ALL),
    (0, common_1.Get)("findings-report/export"),
    (0, swagger_1.ApiOperation)({ summary: "Export findings report as PDF or Excel" }),
    (0, swagger_1.ApiQuery)({ name: "engagementId", type: Number, required: true }),
    (0, swagger_1.ApiQuery)({ name: "format", enum: ["pdf", "excel"], required: true }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)("engagementId")),
    __param(1, (0, common_1.Query)("format")),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "exportFindingsReport", null);
exports.ReportsController = ReportsController = __decorate([
    (0, swagger_1.ApiTags)("Reports"),
    (0, swagger_1.ApiBearerAuth)("JWT"),
    (0, common_1.Controller)("reports"),
    __metadata("design:paramtypes", [reports_service_1.ReportsService,
        report_export_service_1.ReportExportService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map