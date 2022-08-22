import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import {
  AppConfigService,
  TwitterService,
  ProgressService,
  BannerService,
  TasksService,
} from './';
import { HttpModule } from '@nestjs/axios';
import { TwitterClient } from 'twitter-api-client';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          ignoreEnvVars: true,
          ignoreEnvFile: true,
          load: [
            () => ({
              API_KEY: 'API_KEY_VALUE',
              API_SECRET: 'API_SECRET_VALUE',
              ACCESS_TOKEN: 'ACCESS_TOKEN_VALUE',
              ACCESS_SECRET: 'ACCESS_SECRET_VALUE',
              SCREEN_NAME: 'SCREEN_NAME_VALUE',
            }),
          ],
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
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
