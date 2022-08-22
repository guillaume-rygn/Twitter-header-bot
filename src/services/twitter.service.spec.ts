import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AppConfigService, TwitterService } from './';
import { TwitterClient } from 'twitter-api-client';

describe('TwitterService', () => {
  let twitterService: TwitterService;

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
      ],
    }).compile();

    twitterService = module.get<TwitterService>(TwitterService);
  });

  it('should be defined', () => {
    expect(twitterService).toBeDefined();
  });

  describe('screenName', () => {
    it('should be defined', () => {
      expect(twitterService.screenName).toBeDefined();
    });

    it('should be SCREEN_NAME_VALUE', () => {
      expect(twitterService.screenName).toEqual('SCREEN_NAME_VALUE');
    });
  });
});
