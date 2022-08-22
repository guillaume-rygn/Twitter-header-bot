import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { TwitterClient } from 'twitter-api-client';

@Injectable()
export class TwitterService {
  constructor(
    private readonly httpService: HttpService,
    private readonly twitterClient: TwitterClient,
    @Inject('SCREEN_NAME')
    public readonly screenName: string,
  ) {}

  async getFollowerCount(): Promise<number> {
    const usersShow = await this.twitterClient.accountsAndUsers.usersShow({
      screen_name: this.screenName,
      include_entities: false,
    });
    return usersShow.followers_count;
  }

  async updateLocation(location: string): Promise<void> {
    await this.twitterClient.accountsAndUsers.accountUpdateProfile({
      location,
    });
  }

  async getFollowersProfileImageBuffers(): Promise<Buffer[]> {
    const profileImages: Buffer[] = [];
    const followers = await this.twitterClient.accountsAndUsers.followersList({
      count: 3,
    });

    for (const follower of followers.users) {
      const profileImageResponse = await firstValueFrom(
        this.httpService.get(follower.profile_image_url_https, {
          responseType: 'arraybuffer',
        }),
      );
      profileImages.push(profileImageResponse.data);
    }
    return profileImages;
  }

  async updateBanner(banner: Buffer): Promise<void> {
    await this.twitterClient.accountsAndUsers.accountUpdateProfileBanner({
      banner: banner.toString('base64'),
    });
  }
}
