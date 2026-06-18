import { Injectable } from "@nestjs/common";
import PDFDocument from "pdfkit";
import * as ExcelJS from "exceljs";
import { ReportsService } from "./reports.service";
import {
  AuditSummaryReportDto,
  FindingsReportDto,
  RiskReportDto,
} from "../../dtos/reports/report.dto";

@Injectable()
export class ReportExportService {
  constructor(private reportsService: ReportsService) {}

  async exportAuditSummaryPdf(engagementId: number): Promise<Buffer> {
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

  async exportRiskReportPdf(engagementId: number): Promise<Buffer> {
    const report = await this.reportsService.getRiskReport(engagementId);
    const lines = [
      `Engagement: ${report.engagementTitle}`,
      `High: ${report.high}`,
      `Medium: ${report.medium}`,
      `Low: ${report.low}`,
      "",
      ...report.items.map(
        (item) =>
          `${item.title} | ${item.priority} | ${item.status} | Checklist: ${item.checklistProgress}`,
      ),
    ];
    return this.buildPdf("Risk Report", lines);
  }

  async exportFindingsReportPdf(engagementId: number): Promise<Buffer> {
    const report = await this.reportsService.getFindingsReport(engagementId);
    const lines = [
      `Engagement: ${report.engagementTitle}`,
      "",
      ...report.items.map(
        (item) =>
          `${item.issueName} | ${item.findingTitle} | ${item.severity} | ${item.status}`,
      ),
    ];
    return this.buildPdf("Findings Report", lines);
  }

  async exportAuditSummaryExcel(engagementId: number): Promise<Buffer> {
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

  async exportRiskReportExcel(engagementId: number): Promise<Buffer> {
    const report = await this.reportsService.getRiskReport(engagementId);
    const rows: (string | number)[][] = [
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

  async exportFindingsReportExcel(engagementId: number): Promise<Buffer> {
    const report = await this.reportsService.getFindingsReport(engagementId);
    const rows: (string | number)[][] = [
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

  private buildPdf(title: string, lines: string[]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

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

  private async buildExcel(
    sheetName: string,
    rows: (string | number)[][],
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(sheetName);
    rows.forEach((row) => sheet.addRow(row));
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
