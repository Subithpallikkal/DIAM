import { StreamableFile } from "@nestjs/common";
import type { Response } from "express";
import { ReportsService } from "../../services/reports/reports.service";
import { ReportExportService } from "../../services/reports/report-export.service";
import { AuditSummaryReportDto, DashboardStatsDto, FindingsReportDto, RiskReportDto } from "../../dtos/reports/report.dto";
export declare class ReportsController {
    private reportsService;
    private exportService;
    constructor(reportsService: ReportsService, exportService: ReportExportService);
    getDashboardStats(): Promise<DashboardStatsDto>;
    getAuditSummary(engagementId: string): Promise<AuditSummaryReportDto>;
    getRiskReport(engagementId: string): Promise<RiskReportDto>;
    getFindingsReport(engagementId: string): Promise<FindingsReportDto>;
    exportAuditSummary(engagementId: string, format: "pdf" | "excel", res: Response): Promise<StreamableFile>;
    exportRiskReport(engagementId: string, format: "pdf" | "excel", res: Response): Promise<StreamableFile>;
    exportFindingsReport(engagementId: string, format: "pdf" | "excel", res: Response): Promise<StreamableFile>;
}
