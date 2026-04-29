import { Injectable } from '@nestjs/common';
import { EnvService } from './env.service';

@Injectable()
export class FeatureFlagsService {
  constructor(private readonly envService: EnvService) {}

  isRoutesReadEnabled(): boolean {
    return this.envService.getFlag('FEATURE_ROUTES_READ');
  }

  isRoutesCreateEnabled(): boolean {
    return this.envService.getFlag('FEATURE_ROUTES_CREATE');
  }

  isRoutesSeedEnabled(): boolean {
    return this.envService.getFlag('FEATURE_ROUTES_SEED');
  }

  isRoutesUpdateEnabled(): boolean {
    return this.envService.getFlag('FEATURE_ROUTES_UPDATE_ENABLED');
  }

  isRoutesSoftDeleteEnabled(): boolean {
    return this.envService.getFlag('FEATURE_ROUTES_SOFT_DELETE_ENABLED');
  }

  isTrackingEnabled(): boolean {
    return this.envService.getFlag('FEATURE_TRACKING_ENABLED');
  }

  isSoapCacheEnabled(): boolean {
    return this.envService.getFlag('FEATURE_SOAP_CACHE_ENABLED');
  }

  isSoapStubEnabled(): boolean {
    return this.envService.getFlag('FEATURE_SOAP_STUB_ENABLED');
  }
}
