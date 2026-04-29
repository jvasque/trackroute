import { Injectable } from '@nestjs/common';
import { RouteEntity } from '../domain/route.entity';
import { RouteTrackingReading, TrackingAdapter } from '../domain/tracking-adapter';

type CacheEntry = {
  reading: RouteTrackingReading;
  createdAtMs: number;
};

@Injectable()
export class CachedTrackingAdapter implements TrackingAdapter {
  private readonly cache = new Map<number, CacheEntry>();

  constructor(
    private readonly innerAdapter: TrackingAdapter,
    private readonly ttlMs = 60_000,
    private readonly now = () => Date.now()
  ) {}

  async getTracking(route: RouteEntity): Promise<RouteTrackingReading> {
    const cached = this.cache.get(route.id);

    if (cached && this.now() - cached.createdAtMs <= this.ttlMs) {
      return cached.reading;
    }

    const reading = await this.innerAdapter.getTracking(route);

    this.cache.set(route.id, {
      reading,
      createdAtMs: this.now()
    });

    return reading;
  }
}
