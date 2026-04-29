import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from './env.schema';

type FeatureFlagKey =
  | 'FEATURE_ROUTES_READ'
  | 'FEATURE_ROUTES_CREATE'
  | 'FEATURE_ROUTES_SEED'
  | 'FEATURE_ROUTES_UPDATE_ENABLED'
  | 'FEATURE_ROUTES_SOFT_DELETE_ENABLED'
  | 'FEATURE_TRACKING_ENABLED'
  | 'FEATURE_SOAP_CACHE_ENABLED'
  | 'FEATURE_SOAP_STUB_ENABLED';

@Injectable()
export class EnvService {
  constructor(private readonly configService: ConfigService<Env, true>) {}

  get nodeEnv(): Env['NODE_ENV'] {
    return this.configService.get('NODE_ENV', { infer: true });
  }

  get port(): number {
    return this.configService.get('PORT', { infer: true });
  }

  get corsOrigin(): string {
    return this.configService.get('CORS_ORIGIN', { infer: true });
  }

  get databaseUrl(): string {
    return this.configService.get('DATABASE_URL', { infer: true });
  }

  get trackingProvider(): Env['TRACKING_PROVIDER'] {
    return this.configService.get('TRACKING_PROVIDER', { infer: true });
  }

  get soapTrackingUrl(): string {
    return this.configService.get('SOAP_TRACKING_URL', { infer: true });
  }

  get soapTrackingTimeoutMs(): number {
    return this.configService.get('SOAP_TRACKING_TIMEOUT_MS', { infer: true });
  }

  getFlag(flag: FeatureFlagKey): boolean {
    return this.configService.get(flag, { infer: true });
  }
}
