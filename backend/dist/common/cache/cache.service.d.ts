export declare class CacheService {
    private readonly store;
    get<T>(key: string): T | null;
    set(key: string, value: unknown, ttlMs: number): void;
    delete(key: string): void;
    invalidatePrefix(prefix: string): void;
}
