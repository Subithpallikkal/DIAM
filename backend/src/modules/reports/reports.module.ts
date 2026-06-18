import { Module } from "@nestjs/common";
import { ReportsController } from "../../controllers/reports/reports.controller";
import { ReportsService } from "../../services/reports/reports.service";
import { ReportExportService } from "../../services/reports/report-export.service";

@Module({
  controllers: [ReportsController],
  providers: [ReportsService, ReportExportService],
})
export class ReportsModule {}
