import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TwitterClient } from 'twitter-api-client';
import {
  validate,
  AppConfigService,
  TwitterService,
  ProgressService,
  BannerService,
  TasksService,
} from './services';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    ScheduleModule.forRoot(),
    HttpModule,
  ],
  providers: [
    AppConfigService,
    {
      provide: TwitterClient,
      useFactory: (appConfigService: AppConfigService) => {
        return new TwitterClient({
          apiKey: appConfigService.apiKey,
          apiSecret: appConfigService.apiSecret,
          accessToken: appConfigService.accessToken,
          accessTokenSecret: appConfigService.accessSecret,
        });
      },
      inject: [AppConfigService],
    },
    {
      provide: 'SCREEN_NAME',
      useFactory: (appConfigService: AppConfigService) => {
        return appConfigService.screenName;
      },
      inject: [AppConfigService],
    },
    TwitterService,
    ProgressService,
    BannerService,
    TasksService,
  ],
})
export class AppModule {}
