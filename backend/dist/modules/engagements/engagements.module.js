"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EngagementsModule = void 0;
const common_1 = require("@nestjs/common");
const engagements_controller_1 = require("../../controllers/engagements/engagements.controller");
const scopes_controller_1 = require("../../controllers/engagements/scopes.controller");
const required_documents_controller_1 = require("../../controllers/engagements/required-documents.controller");
const engagements_service_1 = require("../../services/engagements/engagements.service");
const scopes_service_1 = require("../../services/engagements/scopes.service");
const required_documents_service_1 = require("../../services/engagements/required-documents.service");
let EngagementsModule = class EngagementsModule {
};
exports.EngagementsModule = EngagementsModule;
exports.EngagementsModule = EngagementsModule = __decorate([
    (0, common_1.Module)({
        controllers: [
            engagements_controller_1.EngagementsController,
            scopes_controller_1.ScopesController,
            required_documents_controller_1.RequiredDocumentsController,
        ],
        providers: [engagements_service_1.EngagementsService, scopes_service_1.ScopesService, required_documents_service_1.RequiredDocumentsService],
    })
], EngagementsModule);
//# sourceMappingURL=engagements.module.js.map