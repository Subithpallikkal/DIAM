import { EngagementStatus } from "../common/engagement.dto";
export declare class CreateEngagementDto {
    clientId: number;
    title: string;
    auditType: string;
    financialYear?: string;
    startDate?: string;
    endDate?: string;
    status?: EngagementStatus;
    description?: string;
}
export declare class UpdateEngagementDto {
    clientId?: number;
    title?: string;
    auditType?: string;
    financialYear?: string;
    startDate?: string;
    endDate?: string;
    status?: EngagementStatus;
    description?: string;
}
export declare class UpsertEngagementDto extends UpdateEngagementDto {
    id?: number;
}
export declare class EngagementListItemDto {
    id: number;
    clientId: number;
    clientName: string;
    title: string;
    auditType: string;
    financialYear: string | null;
    status: string;
    startDate: Date | null;
    endDate: Date | null;
    createdAt: Date;
}
export declare class EngagementDetailDto extends EngagementListItemDto {
    description: string | null;
    updatedAt: Date;
}
export declare class CreateScopeDto {
    name: string;
    description?: string;
}
export declare class ScopeListItemDto {
    id: number;
    name: string;
    description: string | null;
    isActive: boolean;
}
export declare class CreateRequiredDocumentDto {
    documentName: string;
    isRequired?: boolean;
}
export declare class UpdateRequiredDocumentDto {
    isReceived?: boolean;
    isRequired?: boolean;
}
export declare class UpsertRequiredDocumentDto extends UpdateRequiredDocumentDto {
    id?: number;
    documentName?: string;
}
export declare class RequiredDocumentListItemDto {
    id: number;
    documentName: string;
    isRequired: boolean;
    isReceived: boolean;
}
