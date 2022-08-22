import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BannerService } from './banner.service';
import { ProgressService } from './progress.service';
import { TwitterService } from './twitter.service';

@Injectable()
export class TasksService {
  private readonly _logger = new Logger(TasksService.name);

  constructor(
    private readonly twitterService: TwitterService,
    private readonly progressService: ProgressService,
    private readonly bannerService: BannerService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async updateProfile(): Promise<void> {
    this._logger.log('Running update profile for the follower count...');
    const followersCount = await this.twitterService.getFollowerCount();
    const followerProgress = this.progressService.getProgress(followersCount);
    await this.twitterService.updateLocation(followerProgress);
    this._logger.log(
      `Updated profile for the follower count: ${followersCount}`,
    );

    this._logger.log('Running update profile for the banner...');
    const bannerBuffer = await this.bannerService.getBannerBufferFromFile();
    const profileImageBuffers =
      await this.twitterService.getFollowersProfileImageBuffers();
    const generatedBanner = await this.bannerService.generateBanner(
      bannerBuffer,
      profileImageBuffers,
    );
    await this.twitterService.updateBanner(generatedBanner);
    this._logger.log('Updated profile for the banner');
  }
}
