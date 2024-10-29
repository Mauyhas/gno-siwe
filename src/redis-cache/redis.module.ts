import { Module } from '@nestjs/common';
import { RedisModule as NestRedisModule } from '@nestjs-modules/ioredis';
import { RedisService } from './redis.service';

@Module({
  imports: [
    NestRedisModule.forRoot({
      type: 'single', // Single Redis instance
      url: 'redis://localhost:6379', // Redis connection URL
      options: {
        // Additional Redis options, if needed
      },
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
