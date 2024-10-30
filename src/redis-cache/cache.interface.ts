export interface ICacheService {
    set<T>(key: string, value: T): Promise<void>;
    get<T>(key: string): Promise<T | null>;
    delete(key: string): Promise<void>;
    getAll<T>(): Promise<{ key: string; value: T }[]>;
  }
  