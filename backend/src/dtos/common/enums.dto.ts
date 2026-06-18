export enum Priority {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

export enum TaskStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export enum IssueStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
}

export enum RiskStatus {
  OPEN = "OPEN",
  MITIGATED = "MITIGATED",
  CLOSED = "CLOSED",
}

export enum DocumentLogAction {
  UPLOAD = "UPLOAD",
  DOWNLOAD = "DOWNLOAD",
  VIEW = "VIEW",
  DELETE = "DELETE",
}
