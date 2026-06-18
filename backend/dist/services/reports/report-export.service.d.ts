import { ReportsService } from "./reports.service";
export declare class ReportExportService {
    private reportsService;
    constructor(reportsService: ReportsService);
    exportAuditSummaryPdf(engagementId: number): Promise<Buffer>;
    exportRiskReportPdf(engagementId: number): Promise<Buffer>;
    exportFindingsReportPdf(engagementId: number): Promise<Buffer>;
    exportAuditSummaryExcel(engagementId: number): Promise<Buffer>;
    exportRiskReportExcel(engagementId: number): Promise<Buffer>;
    exportFindingsReportExcel(engagementId: number): Promise<Buffer>;
    private buildPdf;
    private buildExcel;
}
