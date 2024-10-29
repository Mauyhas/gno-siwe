import { Controller, Get, Post, Body, Query, NotFoundException } from '@nestjs/common';
import { UserProfileService } from './user.profile.service';
import { UserProfile } from './user.profile.interface'

@Controller('user-profile')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  // Retrieve a user profile by ID
  @Get('get')
  async getProfile(@Query('id') id: string): Promise<UserProfile> {
    console.log('debug')
    const profile = await this.userProfileService.getProfile(id);
    if (!profile) {
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
    const profileData: Partial<UserProfile> = { username, bio };
    return await this.userProfileService.setProfile(id, profileData);
  }
}
