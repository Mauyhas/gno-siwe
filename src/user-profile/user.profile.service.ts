import { Injectable } from '@nestjs/common';
import { UserProfile, IUserProfileService } from './user.profile.interface';
import { Logger } from '@nestjs/common';
import { RedisService } from 'src/redis-cache/redis.service';

@Injectable()
export class UserProfileService implements IUserProfileService {
  private readonly logger = new Logger(UserProfileService.name);
  constructor(private readonly redisService: RedisService) {}

  private getKey(userId: string): string {
    return `profile:${userId}`; // Namespaced key for user profiles
  }

  // Create or update a user profile
  async setProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile> {
    this.logger.log(`SET request for user profile:`, userId)
    const profileFromDb = await this.redisService.get<UserProfile>(this.getKey(userId));
    const profile = {
      ...profileFromDb,
      id: userId,
      ...profileData,
    };
    this.logger.log(`Updated profile:`, profile)
    await this.redisService.set(this.getKey(userId), profile);
    return profile;
  }

  // Retrieve a user profile by ID
  async getProfile(userId: string): Promise<UserProfile | null> {
    this.logger.log(`GET request for user profile:`, userId)
    return await this.redisService.get<UserProfile>(this.getKey(userId));
  }
}
