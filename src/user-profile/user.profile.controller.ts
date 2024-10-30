import { Controller, Get, Post, Body, Query, NotFoundException } from '@nestjs/common';
import { UserProfileService } from './user.profile.service';
import { UserProfile } from './user.profile.interface'
import { Logger } from '@nestjs/common';

@Controller('user-profile')
export class UserProfileController {
  private readonly logger = new Logger(UserProfileController.name);
  constructor(private readonly userProfileService: UserProfileService) {}

  // Retrieve a user profile by ID
  @Get('get')
  async getProfile(@Query('id') id: string): Promise<UserProfile> {
    this.logger.log(`Received request to get profile with ID: ${id}`);
    const profile = await this.userProfileService.getProfile(id);
    if (!profile) {
      this.logger.error(`Received request with no matching profile: ${id}`);
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
    return profile;
  }

  // Create or update a user profile
  @Post('set')
  async setProfile(
    @Body('profileId') id: string,
    @Body('username') username: string,
    @Body('bio') bio: string,
  ): Promise<UserProfile> {
    this.logger.log(`Received request to get profile with ID: ${id}`);
    const profileData: Partial<UserProfile> = { username, bio };
    return await this.userProfileService.setProfile(id, profileData);
  
  }
}
