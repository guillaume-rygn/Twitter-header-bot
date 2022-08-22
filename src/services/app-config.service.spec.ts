import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { validate, EnvironmentVariables, AppConfigService } from './';
import { WrongConfigError } from '../errors';

describe('AppConfigService', () => {
  let service: AppConfigService;

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
      ],
      providers: [AppConfigService],
    }).compile();

    service = module.get<AppConfigService>(AppConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validate', () => {
    it('should be defined', () => {
      expect(validate).toBeDefined();
    });

    it('should validate', () => {
      const toValidate = {
        API_KEY: 'TO_VALIDATE',
        API_SECRET: 'TO_VALIDATE',
        ACCESS_TOKEN: 'TO_VALIDATE',
        ACCESS_SECRET: 'TO_VALIDATE',
        SCREEN_NAME: 'TO_VALIDATE',
      };

      const environmentVariablesExpected = new EnvironmentVariables();
      environmentVariablesExpected.API_KEY = 'TO_VALIDATE';
      environmentVariablesExpected.API_SECRET = 'TO_VALIDATE';
      environmentVariablesExpected.ACCESS_TOKEN = 'TO_VALIDATE';
      environmentVariablesExpected.ACCESS_SECRET = 'TO_VALIDATE';
      environmentVariablesExpected.SCREEN_NAME = 'TO_VALIDATE';

      const validated = validate(toValidate);
      expect(validated).toBeDefined();
      expect(validated).toEqual(environmentVariablesExpected);
    });

    it('should throw wrong config error', () => {
      const toValidate = {
        API_KEY: 'TO_VALIDATE',
        API_SECRET: 'TO_VALIDATE',
        ACCESS_TOKEN: 'TO_VALIDATE',
        ACCESS_SECRET: 'TO_VALIDATE',
        SCREEN_NAME: undefined,
      };

      expect(() => {
        validate(toValidate);
      }).toThrow(WrongConfigError);
    });
  });

  describe('get apiKey', () => {
    it('should be defined', () => {
      expect(service.apiKey).toBeDefined();
    });

    it('should be equals to API_KEY_VALUE', () => {
      expect(service.apiKey).toEqual('API_KEY_VALUE');
    });
  });

  describe('get apiSecret', () => {
    it('should be defined', () => {
      expect(service.apiSecret).toBeDefined();
    });

    it('should be equals to API_SECRET_VALUE', () => {
      expect(service.apiSecret).toEqual('API_SECRET_VALUE');
    });
  });

  describe('get accessToken', () => {
    it('should be defined', () => {
      expect(service.accessToken).toBeDefined();
    });

    it('should be equals to ACCESS_TOKEN_VALUE', () => {
      expect(service.accessToken).toEqual('ACCESS_TOKEN_VALUE');
    });
  });

  describe('get apiSecret', () => {
    it('should be defined', () => {
      expect(service.apiSecret).toBeDefined();
    });

    it('should be equals to ACCESS_SECRET_VALUE', () => {
      expect(service.accessSecret).toEqual('ACCESS_SECRET_VALUE');
    });
  });

  describe('get screenName', () => {
    it('should be defined', () => {
      expect(service.screenName).toBeDefined();
    });

    it('should be equals to SCREEN_NAME_VALUE', () => {
      expect(service.screenName).toEqual('SCREEN_NAME_VALUE');
    });
  });
});
