import { Module } from "@nestjs/common";
import { EngagementsController } from "../../controllers/engagements/engagements.controller";
import { ScopesController } from "../../controllers/engagements/scopes.controller";
import { RequiredDocumentsController } from "../../controllers/engagements/required-documents.controller";
import { EngagementsService } from "../../services/engagements/engagements.service";
import { ScopesService } from "../../services/engagements/scopes.service";
import { RequiredDocumentsService } from "../../services/engagements/required-documents.service";

@Module({
  controllers: [
    EngagementsController,
    ScopesController,
    RequiredDocumentsController,
  ],
  providers: [EngagementsService, ScopesService, RequiredDocumentsService],
})
export class EngagementsModule {}
