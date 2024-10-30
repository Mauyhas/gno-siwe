export interface UserProfile {
    id: string;           // Unique ID for the user (typically the wallet address)
    username: string;     // Username for the profile
    bio: string;          // Short bio for the user
}
export interface IUserProfileService {
    /**
     * Sets or updates a user profile.
     * @param userId - The unique ID of the user.
     * @param profileData - Partial profile data to update or create.
     * @returns The updated or newly created user profile.
     */
    setProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile>;
  
    /**
     * Retrieves a user profile by ID.
     * @param userId - The unique ID of the user.
     * @returns The user profile if found, or null otherwise.
     */
    getProfile(userId: string): Promise<UserProfile | null>;
  }
