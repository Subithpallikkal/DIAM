"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentLogAction = exports.RiskStatus = exports.IssueStatus = exports.TaskStatus = exports.Priority = void 0;
const openapi = require("@nestjs/swagger");
var Priority;
(function (Priority) {
    Priority["HIGH"] = "HIGH";
    Priority["MEDIUM"] = "MEDIUM";
    Priority["LOW"] = "LOW";
})(Priority || (exports.Priority = Priority = {}));
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["PENDING"] = "PENDING";
    TaskStatus["IN_PROGRESS"] = "IN_PROGRESS";
    TaskStatus["COMPLETED"] = "COMPLETED";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
var IssueStatus;
(function (IssueStatus) {
    IssueStatus["OPEN"] = "OPEN";
    IssueStatus["IN_PROGRESS"] = "IN_PROGRESS";
    IssueStatus["RESOLVED"] = "RESOLVED";
    IssueStatus["CLOSED"] = "CLOSED";
})(IssueStatus || (exports.IssueStatus = IssueStatus = {}));
var RiskStatus;
(function (RiskStatus) {
    RiskStatus["OPEN"] = "OPEN";
    RiskStatus["MITIGATED"] = "MITIGATED";
    RiskStatus["CLOSED"] = "CLOSED";
})(RiskStatus || (exports.RiskStatus = RiskStatus = {}));
var DocumentLogAction;
(function (DocumentLogAction) {
    DocumentLogAction["UPLOAD"] = "UPLOAD";
    DocumentLogAction["DOWNLOAD"] = "DOWNLOAD";
    DocumentLogAction["VIEW"] = "VIEW";
    DocumentLogAction["DELETE"] = "DELETE";
})(DocumentLogAction || (exports.DocumentLogAction = DocumentLogAction = {}));
//# sourceMappingURL=enums.dto.js.map