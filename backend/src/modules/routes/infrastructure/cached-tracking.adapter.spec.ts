import { RouteStatus } from '../domain/route-status.enum';
import { CachedTrackingAdapter } from './cached-tracking.adapter';

describe('CachedTrackingAdapter', () => {
  it('reuses a cached reading within the ttl window', async () => {
    let currentMs = Date.now();
    const innerAdapter = {
      getTracking: jest.fn().mockResolvedValue({
        routeId: 1,
        lastLocation: 'Bogotá',
        latitude: 4.5,
        longitude: -74.1,
        progressPercent: 50,
        etaMinutes: 120,
        sourceTimestamp: new Date('2024-01-01T00:00:00.000Z')
      })
    };
    const adapter = new CachedTrackingAdapter(innerAdapter, 60_000, () => currentMs);
    const route = {
      id: 1,
      originCity: 'Bogotá',
      destinationCity: 'Cali',
      distanceKm: 462,
      estimatedTimeHours: 9.5,
      vehicleType: 'CAMION',
      carrier: 'TransAndes',
      costUsd: 390,
      status: RouteStatus.ACTIVA,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    };

    await adapter.getTracking(route);
    currentMs += 30_000;
    await adapter.getTracking(route);

    expect(innerAdapter.getTracking).toHaveBeenCalledTimes(1);
  });
});
