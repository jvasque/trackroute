import { Module } from '@nestjs/common';
import { AppConfigModule } from '../../config/config.module';
import { CreateRouteUseCase } from './application/create-route.use-case';
import { GetActiveRoutesTrackingUseCase } from './application/get-active-routes-tracking.use-case';
import { GetRouteByIdUseCase } from './application/get-route-by-id.use-case';
import { ListRoutesUseCase } from './application/list-routes.use-case';
import { SoftDeleteRouteUseCase } from './application/soft-delete-route.use-case';
import { UpdateRouteUseCase } from './application/update-route.use-case';
import { ROUTE_REPOSITORY } from './domain/route.repository';
import { RAW_TRACKING_ADAPTER, TRACKING_ADAPTER } from './domain/tracking-adapter';
import { CachedTrackingAdapter } from './infrastructure/cached-tracking.adapter';
import { PrismaRouteRepository } from './infrastructure/prisma-route.repository';
import { SoapTrackingAdapter } from './infrastructure/soap-tracking.adapter';
import { StubTrackingAdapter } from './infrastructure/stub-tracking.adapter';
import { RoutesController } from './routes.controller';
import { EnvService } from '../../config/env.service';
import { FeatureFlagsService } from '../../config/feature-flags.service';

@Module({
  imports: [AppConfigModule],
  controllers: [RoutesController],
  providers: [
    ListRoutesUseCase,
    CreateRouteUseCase,
    GetActiveRoutesTrackingUseCase,
    GetRouteByIdUseCase,
    UpdateRouteUseCase,
    SoftDeleteRouteUseCase,
    PrismaRouteRepository,
    StubTrackingAdapter,
    SoapTrackingAdapter,
    {
      provide: ROUTE_REPOSITORY,
      useExisting: PrismaRouteRepository
    },
    {
      provide: RAW_TRACKING_ADAPTER,
      inject: [EnvService, FeatureFlagsService, StubTrackingAdapter, SoapTrackingAdapter],
      useFactory: (
        envService: EnvService,
        featureFlags: FeatureFlagsService,
        stubTrackingAdapter: StubTrackingAdapter,
        soapTrackingAdapter: SoapTrackingAdapter
      ) => {
        if (featureFlags.isSoapStubEnabled() || envService.trackingProvider === 'stub') {
          return stubTrackingAdapter;
        }

        return soapTrackingAdapter;
      }
    },
    {
      provide: TRACKING_ADAPTER,
      inject: [FeatureFlagsService, RAW_TRACKING_ADAPTER],
      useFactory: (featureFlags: FeatureFlagsService, rawAdapter: SoapTrackingAdapter | StubTrackingAdapter) => {
        if (featureFlags.isSoapCacheEnabled()) {
          return new CachedTrackingAdapter(rawAdapter);
        }

        return rawAdapter;
      }
    }
  ]
})
export class RoutesModule {}
