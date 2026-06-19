export declare class CreateClientDto {
    name: string;
    code?: string;
    email?: string;
    phone?: string;
    address?: string;
    gstNumber?: string;
}
export declare class UpdateClientDto {
    name?: string;
    code?: string;
    email?: string;
    phone?: string;
    address?: string;
    gstNumber?: string;
    isActive?: boolean;
}
export declare class UpsertClientDto extends UpdateClientDto {
    id?: number;
}
export declare class ClientListItemDto {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    gstNumber: string | null;
    isActive: boolean;
    createdAt: Date;
}
export declare class ClientDetailDto extends ClientListItemDto {
    code: string | null;
    address: string | null;
    updatedAt: Date;
}
