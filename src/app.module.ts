import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppService } from './app.service';
import { RedisModule as NestRedisModule } from '@nestjs-modules/ioredis';
import { RedisModule } from './redis-cache/redis.module';
import { UserProfileModule } from './user-profile/user.profile.module';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'client', 'dist'), // Serve files from client/dist
      serveRoot: '/', // Makes files available at root URL
    }),
    NestRedisModule.forRoot({
      type: 'single',
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`, // Use Redis connection string with environment variables
    }),
    RedisModule,
    UserProfileModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
