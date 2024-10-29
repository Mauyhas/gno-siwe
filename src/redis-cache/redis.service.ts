import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { KeyValue } from './redis.interface';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async set<T>(key: string, value: T): Promise<void> {
    await this.redis.set(key, JSON.stringify(value));
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async getAll<T>(): Promise<KeyValue<T>[]> {
    const keys = await this.redis.keys('*');
    const keyValuePairs = await Promise.all(
      keys.map(async (key) => ({
        key,
        value: JSON.parse(await this.redis.get(key)),
      })),
    );
    return keyValuePairs;
  }
}
