import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Res,
  StreamableFile,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import type { Response } from "express";
import { ReportsService } from "../../services/reports/reports.service";
import { ReportExportService } from "../../services/reports/report-export.service";
import {
  AuditSummaryReportDto,
  DashboardStatsDto,
  FindingsReportDto,
  MyDashboardStatsDto,
  RiskReportDto,
} from "../../dtos/reports/report.dto";
import { RequireRoles } from "../../common/decorators/roles.decorator";
import { Roles } from "../../common/constants/roles.constants";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtPayload } from "../../common/interfaces/jwt-payload.interface";
import { SwaggerExamples } from "../../common/swagger/api-examples";

@ApiTags("Reports")
@ApiBearerAuth("JWT")
@Controller("reports")
export class ReportsController {
  constructor(
    private reportsService: ReportsService,
    private exportService: ReportExportService,
  ) {}

  @RequireRoles(...Roles.ALL)
  @Get("dashboard")
  @ApiOperation({ summary: "Get dashboard statistics" })
  @ApiOkResponse({
    type: DashboardStatsDto,
    schema: { example: SwaggerExamples.reports.dashboard },
  })
  getDashboardStats() {
    return this.reportsService.getDashboardStats();
  }

  @RequireRoles(...Roles.ALL)
  @Get("my-dashboard")
  @ApiOperation({ summary: "Get personal dashboard for current user" })
  @ApiOkResponse({
    type: MyDashboardStatsDto,
    schema: { example: SwaggerExamples.reports.myDashboard },
  })
  getMyDashboardStats(@CurrentUser() user: JwtPayload) {
    return this.reportsService.getMyDashboardStats(user.sub);
  }

  @RequireRoles(...Roles.ALL)
  @Get("audit-summary")
  @ApiOperation({ summary: "Get audit summary report" })
  @ApiQuery({ name: "engagementId", type: Number, required: true })
  @ApiOkResponse({
    type: AuditSummaryReportDto,
    schema: { example: SwaggerExamples.reports.auditSummary },
  })
  getAuditSummary(@Query("engagementId") engagementId: string) {
    return this.reportsService.getAuditSummary(Number(engagementId));
  }

  @RequireRoles(...Roles.ALL)
  @Get("risk-report")
  @ApiOperation({ summary: "Get risk report" })
  @ApiQuery({ name: "engagementId", type: Number, required: true })
  @ApiOkResponse({
    type: RiskReportDto,
    schema: { example: SwaggerExamples.reports.riskReport },
  })
  getRiskReport(@Query("engagementId") engagementId: string) {
    return this.reportsService.getRiskReport(Number(engagementId));
  }

  @RequireRoles(...Roles.ALL)
  @Get("findings-report")
  @ApiOperation({ summary: "Get findings report" })
  @ApiQuery({ name: "engagementId", type: Number, required: true })
  @ApiOkResponse({
    type: FindingsReportDto,
    schema: { example: SwaggerExamples.reports.findingsReport },
  })
  getFindingsReport(@Query("engagementId") engagementId: string) {
    return this.reportsService.getFindingsReport(Number(engagementId));
  }

  @RequireRoles(...Roles.ALL)
  @Get("audit-summary/export")
  @ApiOperation({ summary: "Export audit summary as PDF or Excel" })
  @ApiQuery({ name: "engagementId", type: Number, required: true })
  @ApiQuery({ name: "format", enum: ["pdf", "excel"], required: true })
  async exportAuditSummary(
    @Query("engagementId") engagementId: string,
    @Query("format") format: "pdf" | "excel",
    @Res({ passthrough: true }) res: Response,
  ) {
    const id = Number(engagementId);
    const buffer =
      format === "excel"
        ? await this.exportService.exportAuditSummaryExcel(id)
        : await this.exportService.exportAuditSummaryPdf(id);

    const contentType =
      format === "excel"
        ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        : "application/pdf";
    const extension = format === "excel" ? "xlsx" : "pdf";

    res.set({
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="audit-summary.${extension}"`,
    });

    return new StreamableFile(buffer);
  }

  @RequireRoles(...Roles.ALL)
  @Get("risk-report/export")
  @ApiOperation({ summary: "Export risk report as PDF or Excel" })
  @ApiQuery({ name: "engagementId", type: Number, required: true })
  @ApiQuery({ name: "format", enum: ["pdf", "excel"], required: true })
  async exportRiskReport(
    @Query("engagementId") engagementId: string,
    @Query("format") format: "pdf" | "excel",
    @Res({ passthrough: true }) res: Response,
  ) {
    const id = Number(engagementId);
    const buffer =
      format === "excel"
        ? await this.exportService.exportRiskReportExcel(id)
        : await this.exportService.exportRiskReportPdf(id);

    const contentType =
      format === "excel"
        ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        : "application/pdf";
    const extension = format === "excel" ? "xlsx" : "pdf";

    res.set({
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="risk-report.${extension}"`,
    });

    return new StreamableFile(buffer);
  }

  @RequireRoles(...Roles.ALL)
  @Get("findings-report/export")
  @ApiOperation({ summary: "Export findings report as PDF or Excel" })
  @ApiQuery({ name: "engagementId", type: Number, required: true })
  @ApiQuery({ name: "format", enum: ["pdf", "excel"], required: true })
  async exportFindingsReport(
    @Query("engagementId") engagementId: string,
    @Query("format") format: "pdf" | "excel",
    @Res({ passthrough: true }) res: Response,
  ) {
    const id = Number(engagementId);
    const buffer =
      format === "excel"
        ? await this.exportService.exportFindingsReportExcel(id)
        : await this.exportService.exportFindingsReportPdf(id);

    const contentType =
      format === "excel"
        ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        : "application/pdf";
    const extension = format === "excel" ? "xlsx" : "pdf";

    res.set({
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="findings-report.${extension}"`,
    });

    return new StreamableFile(buffer);
  }
}
