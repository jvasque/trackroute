import { RouteEntity, RouteTrackingSnapshotEntity } from '../domain/route.entity';

export type RouteTrackingItemDto = {
  route: {
    id: number;
    originCity: string;
    destinationCity: string;
    vehicleType: string;
    carrier: string;
    status: string;
  };
  tracking: {
    lastLocation: string;
    latitude: number | null;
    longitude: number | null;
    progressPercent: number;
    etaMinutes: number;
    sourceTimestamp: string;
    createdAt: string;
  };
};

export type ActiveRoutesTrackingResponseDto = {
  data: RouteTrackingItemDto[];
};

export function toRouteTrackingItemDto(
  route: RouteEntity,
  snapshot: RouteTrackingSnapshotEntity
): RouteTrackingItemDto {
  return {
    route: {
      id: route.id,
      originCity: route.originCity,
      destinationCity: route.destinationCity,
      vehicleType: route.vehicleType,
      carrier: route.carrier,
      status: route.status
    },
    tracking: {
      lastLocation: snapshot.lastLocation,
      latitude: snapshot.latitude,
      longitude: snapshot.longitude,
      progressPercent: snapshot.progressPercent,
      etaMinutes: snapshot.etaMinutes,
      sourceTimestamp: snapshot.sourceTimestamp.toISOString(),
      createdAt: snapshot.createdAt.toISOString()
    }
  };
}
