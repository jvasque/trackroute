import { RouteStatus } from '../domain/route-status.enum';
import { StubTrackingAdapter } from './stub-tracking.adapter';

describe('StubTrackingAdapter', () => {
  it('returns deterministic tracking data for an active route', async () => {
    const adapter = new StubTrackingAdapter();
    const route = {
      id: 10,
      originCity: 'Bogotá',
      destinationCity: 'Cali',
      distanceKm: 462,
      estimatedTimeHours: 9.5,
      vehicleType: 'CAMION',
      carrier: 'TransAndes',
      costUsd: 390,
      status: RouteStatus.ACTIVA,
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-01T00:00:00.000Z'),
      deletedAt: null
    };

    const result = await adapter.getTracking(route);

    expect(result.routeId).toBe(10);
    expect(result.progressPercent).toBeGreaterThanOrEqual(35);
    expect(result.progressPercent).toBeLessThanOrEqual(95);
    expect(result.lastLocation.length).toBeGreaterThan(0);
    expect(result.etaMinutes).toBeGreaterThan(0);
  });
});
