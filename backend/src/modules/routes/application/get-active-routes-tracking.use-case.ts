import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { FeatureFlagsService } from '../../../config/feature-flags.service';
import { CreateRouteTrackingSnapshotData, RouteTrackingSnapshotEntity } from '../domain/route.entity';
import { ROUTE_REPOSITORY, RouteRepository } from '../domain/route.repository';
import { TRACKING_ADAPTER, TrackingAdapter } from '../domain/tracking-adapter';
import {
  ActiveRoutesTrackingResponseDto,
  toRouteTrackingItemDto
} from '../dto/route-tracking-response.dto';

const TRACKING_TTL_MS = 60_000;

@Injectable()
export class GetActiveRoutesTrackingUseCase {
  constructor(
    @Inject(ROUTE_REPOSITORY)
    private readonly routeRepository: RouteRepository,
    @Inject(TRACKING_ADAPTER)
    private readonly trackingAdapter: TrackingAdapter,
    private readonly featureFlags: FeatureFlagsService
  ) {}

  async execute(): Promise<ActiveRoutesTrackingResponseDto> {
    if (!this.featureFlags.isTrackingEnabled()) {
      throw new ForbiddenException('Tracking feature is disabled');
    }

    const routes = await this.routeRepository.findActive();
    const items = await Promise.all(routes.map(async (route) => {
      const existingSnapshot = await this.routeRepository.findLatestTrackingSnapshot(route.id);
      const snapshot = this.isFreshSnapshot(existingSnapshot)
        ? existingSnapshot
        : await this.refreshSnapshot(route.id, route);

      return toRouteTrackingItemDto(route, snapshot);
    }));

    return { data: items };
  }

  private isFreshSnapshot(snapshot: RouteTrackingSnapshotEntity | null): snapshot is RouteTrackingSnapshotEntity {
    return snapshot !== null && Date.now() - snapshot.createdAt.getTime() <= TRACKING_TTL_MS;
  }

  private async refreshSnapshot(routeId: number, route: Parameters<TrackingAdapter['getTracking']>[0]): Promise<RouteTrackingSnapshotEntity> {
    const reading = await this.trackingAdapter.getTracking(route);
    const data: CreateRouteTrackingSnapshotData = {
      routeId,
      lastLocation: reading.lastLocation,
      latitude: reading.latitude,
      longitude: reading.longitude,
      progressPercent: reading.progressPercent,
      etaMinutes: reading.etaMinutes,
      sourceTimestamp: reading.sourceTimestamp
    };

    return this.routeRepository.createTrackingSnapshot(data);
  }
}
