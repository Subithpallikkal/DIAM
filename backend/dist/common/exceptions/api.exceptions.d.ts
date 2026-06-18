export declare class ValidationException extends Error {
    readonly details?: unknown | undefined;
    readonly validationErrors?: unknown | undefined;
    constructor(message: string, details?: unknown | undefined, validationErrors?: unknown | undefined);
}
export declare class NotFoundException extends Error {
    readonly errorCode: string;
    constructor(message: string, errorCode?: string);
}
export declare class ServerErrorException extends Error {
    readonly errorCode: string;
    readonly details?: unknown | undefined;
    constructor(message: string, errorCode?: string, details?: unknown | undefined);
}
