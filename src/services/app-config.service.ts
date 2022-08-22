import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsString, validateSync } from 'class-validator';
import { WrongConfigError } from '../errors';

export class EnvironmentVariables {
  @IsNotEmpty()
  @IsString()
  API_KEY: string;

  @IsNotEmpty()
  @IsString()
  API_SECRET: string;

  @IsNotEmpty()
  @IsString()
  ACCESS_TOKEN: string;

  @IsNotEmpty()
  @IsString()
  ACCESS_SECRET: string;

  @IsNotEmpty()
  @IsString()
  SCREEN_NAME: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new WrongConfigError();
  }
  return validatedConfig;
}

@Injectable()
export class AppConfigService {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {}

  get apiKey(): string {
    return this.configService.get('API_KEY');
  }

  get apiSecret(): string {
    return this.configService.get('API_SECRET');
  }

  get accessToken(): string {
    return this.configService.get('ACCESS_TOKEN');
  }

  get accessSecret(): string {
    return this.configService.get('ACCESS_SECRET');
  }

  get screenName(): string {
    return this.configService.get('SCREEN_NAME');
  }
}
