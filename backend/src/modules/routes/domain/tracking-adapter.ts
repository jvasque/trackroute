import { RouteEntity } from './route.entity';

export type RouteTrackingReading = {
  routeId: number;
  lastLocation: string;
  latitude: number | null;
  longitude: number | null;
  progressPercent: number;
  etaMinutes: number;
  sourceTimestamp: Date;
};

export const TRACKING_ADAPTER = Symbol('TRACKING_ADAPTER');
export const RAW_TRACKING_ADAPTER = Symbol('RAW_TRACKING_ADAPTER');

export interface TrackingAdapter {
  getTracking(route: RouteEntity): Promise<RouteTrackingReading>;
}
