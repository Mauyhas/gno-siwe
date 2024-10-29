import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis-cache/redis.service';
import { UserProfile } from './user.profile.interface';

@Injectable()
export class UserProfileService {
  constructor(private readonly redisService: RedisService) {}

  private getKey(userId: string): string {
    return `profile:${userId}`; // Namespaced key for user profiles
  }

  // Create or update a user profile
  async setProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile> {
    console.log('userID set', userId)
    const existingProfile = await this.redisService.get<UserProfile>(this.getKey(userId));
    const profile = {
      ...existingProfile,
      id: userId,
      ...profileData,
    };
    await this.redisService.set(this.getKey(userId), profile);
    return profile;
  }

  // Retrieve a user profile by ID
  async getProfile(userId: string): Promise<UserProfile | null> {
    console.log('userId get', userId)
    return await this.redisService.get<UserProfile>(this.getKey(userId));
  }
}
