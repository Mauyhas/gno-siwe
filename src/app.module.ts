import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppService } from './app.service';
import { RedisModule } from './redis-cache/redis.module'
import { UserProfileModule } from './user-profile/user.profile.module'

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    RedisModule,
    UserProfileModule, // Ensure this module is listed here
  ],
})
export class AppModule {}

