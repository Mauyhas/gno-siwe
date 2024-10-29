import { Module } from '@nestjs/common';
import { UserProfileService } from './user.profile.service';
import { UserProfileController } from './user.profile.controller';
import { RedisModule } from '../redis-cache/redis.module'

@Module({
  imports: [RedisModule],
  providers: [UserProfileService],
  controllers: [UserProfileController],
})
export class UserProfileModule {}
