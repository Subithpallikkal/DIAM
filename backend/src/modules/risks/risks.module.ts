import { Module } from "@nestjs/common";
import { RisksController } from "../../controllers/risks/risks.controller";
import { RisksService } from "../../services/risks/risks.service";

@Module({
  controllers: [RisksController],
  providers: [RisksService],
})
export class RisksModule {}
