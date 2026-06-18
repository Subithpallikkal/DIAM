"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportExportService = void 0;
const common_1 = require("@nestjs/common");
const pdfkit_1 = __importDefault(require("pdfkit"));
const ExcelJS = __importStar(require("exceljs"));
const reports_service_1 = require("./reports.service");
let ReportExportService = class ReportExportService {
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    async exportAuditSummaryPdf(engagementId) {
        const report = await this.reportsService.getAuditSummary(engagementId);
        return this.buildPdf("Audit Summary Report", [
            `Engagement: ${report.engagementTitle}`,
            `Client: ${report.clientName}`,
            `Total Risks: ${report.totalRisks}`,
            `Open Issues: ${report.openIssues}`,
            `Resolved Issues: ${report.resolvedIssues}`,
            `Pending Tasks: ${report.pendingTasks}`,
            `Completed Tasks: ${report.completedTasks}`,
            `Total Documents: ${report.totalDocuments}`,
        ]);
    }
    async exportRiskReportPdf(engagementId) {
        const report = await this.reportsService.getRiskReport(engagementId);
        const lines = [
            `Engagement: ${report.engagementTitle}`,
            `High: ${report.high}`,
            `Medium: ${report.medium}`,
            `Low: ${report.low}`,
            "",
            ...report.items.map((item) => `${item.title} | ${item.priority} | ${item.status} | Checklist: ${item.checklistProgress}`),
        ];
        return this.buildPdf("Risk Report", lines);
    }
    async exportFindingsReportPdf(engagementId) {
        const report = await this.reportsService.getFindingsReport(engagementId);
        const lines = [
            `Engagement: ${report.engagementTitle}`,
            "",
            ...report.items.map((item) => `${item.issueName} | ${item.findingTitle} | ${item.severity} | ${item.status}`),
        ];
        return this.buildPdf("Findings Report", lines);
    }
    async exportAuditSummaryExcel(engagementId) {
        const report = await this.reportsService.getAuditSummary(engagementId);
        return this.buildExcel("Audit Summary", [
            ["Metric", "Value"],
            ["Engagement", report.engagementTitle],
            ["Client", report.clientName],
            ["Total Risks", report.totalRisks],
            ["Open Issues", report.openIssues],
            ["Resolved Issues", report.resolvedIssues],
            ["Pending Tasks", report.pendingTasks],
            ["Completed Tasks", report.completedTasks],
            ["Total Documents", report.totalDocuments],
        ]);
    }
    async exportRiskReportExcel(engagementId) {
        const report = await this.reportsService.getRiskReport(engagementId);
        const rows = [
            ["Title", "Priority", "Status", "Checklist Progress"],
            ...report.items.map((item) => [
                item.title,
                item.priority,
                item.status,
                item.checklistProgress,
            ]),
        ];
        return this.buildExcel("Risk Report", rows);
    }
    async exportFindingsReportExcel(engagementId) {
        const report = await this.reportsService.getFindingsReport(engagementId);
        const rows = [
            ["Issue", "Finding", "Severity", "Status"],
            ...report.items.map((item) => [
                item.issueName,
                item.findingTitle,
                item.severity,
                item.status,
            ]),
        ];
        return this.buildExcel("Findings Report", rows);
    }
    buildPdf(title, lines) {
        return new Promise((resolve, reject) => {
            const doc = new pdfkit_1.default({ margin: 50 });
            const chunks = [];
            doc.on("data", (chunk) => chunks.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(chunks)));
            doc.on("error", reject);
            doc.fontSize(18).text(title, { underline: true });
            doc.moveDown();
            doc.fontSize(12);
            lines.forEach((line) => doc.text(line));
            doc.end();
        });
    }
    async buildExcel(sheetName, rows) {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet(sheetName);
        rows.forEach((row) => sheet.addRow(row));
        const buffer = await workbook.xlsx.writeBuffer();
        return Buffer.from(buffer);
    }
};
exports.ReportExportService = ReportExportService;
exports.ReportExportService = ReportExportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportExportService);
//# sourceMappingURL=report-export.service.js.map