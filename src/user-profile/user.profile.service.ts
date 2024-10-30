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
    const existingProfile = await this.redisService.get<UserProfile>(this.getKey(userId));
    this.logger.log(`Existing profile:`, existingProfile)
    const profile = {
      ...existingProfile,
      id: userId,
      ...profileData,
    };
    this.logger.log(`New profile:`, existingProfile)
    await this.redisService.set(this.getKey(userId), profile);
    return profile;
  }

  // Retrieve a user profile by ID
  async getProfile(userId: string): Promise<UserProfile | null> {
    
    return await this.redisService.get<UserProfile>(this.getKey(userId));
  }
}
