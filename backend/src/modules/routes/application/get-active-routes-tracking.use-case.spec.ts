import { ForbiddenException } from '@nestjs/common';
import { FeatureFlagsService } from '../../../config/feature-flags.service';
import { RouteRepository } from '../domain/route.repository';
import { TrackingAdapter } from '../domain/tracking-adapter';
import { RouteStatus } from '../domain/route-status.enum';
import { GetActiveRoutesTrackingUseCase } from './get-active-routes-tracking.use-case';

describe('GetActiveRoutesTrackingUseCase', () => {
  const repository: jest.Mocked<RouteRepository> = {
    findMany: jest.fn(),
    findActive: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
    findLatestTrackingSnapshot: jest.fn(),
    createTrackingSnapshot: jest.fn()
  };

  const trackingAdapter: jest.Mocked<TrackingAdapter> = {
    getTracking: jest.fn()
  };

  const featureFlags: jest.Mocked<FeatureFlagsService> = {
    isRoutesReadEnabled: jest.fn(),
    isRoutesCreateEnabled: jest.fn(),
    isRoutesSeedEnabled: jest.fn(),
    isRoutesUpdateEnabled: jest.fn(),
    isRoutesSoftDeleteEnabled: jest.fn(),
    isTrackingEnabled: jest.fn(),
    isSoapCacheEnabled: jest.fn(),
    isSoapStubEnabled: jest.fn()
  } as unknown as jest.Mocked<FeatureFlagsService>;

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
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    deletedAt: null
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns tracking for active routes using a fresh snapshot when available', async () => {
    featureFlags.isTrackingEnabled.mockReturnValue(true);
    repository.findActive.mockResolvedValue([route]);
    repository.findLatestTrackingSnapshot.mockResolvedValue({
      id: 1,
      routeId: 1,
      lastLocation: 'Bogotá',
      latitude: 4.5,
      longitude: -74.1,
      progressPercent: 65,
      etaMinutes: 90,
      sourceTimestamp: new Date('2024-01-01T00:00:00.000Z'),
      createdAt: new Date()
    });

    const useCase = new GetActiveRoutesTrackingUseCase(repository, trackingAdapter, featureFlags);
    const result = await useCase.execute();

    expect(repository.findActive).toHaveBeenCalled();
    expect(repository.findMany).not.toHaveBeenCalled();
    expect(trackingAdapter.getTracking).not.toHaveBeenCalled();
    expect(result.data).toHaveLength(1);
    expect(result.data[0].tracking.progressPercent).toBe(65);
  });

  it('creates a new snapshot when there is no fresh cached snapshot', async () => {
    featureFlags.isTrackingEnabled.mockReturnValue(true);
    repository.findActive.mockResolvedValue([route]);
    repository.findLatestTrackingSnapshot.mockResolvedValue(null);
    trackingAdapter.getTracking.mockResolvedValue({
      routeId: 1,
      lastLocation: 'Corredor logístico',
      latitude: 4.8,
      longitude: -73.7,
      progressPercent: 72,
      etaMinutes: 60,
      sourceTimestamp: new Date('2024-01-01T01:00:00.000Z')
    });
    repository.createTrackingSnapshot.mockResolvedValue({
      id: 10,
      routeId: 1,
      lastLocation: 'Corredor logístico',
      latitude: 4.8,
      longitude: -73.7,
      progressPercent: 72,
      etaMinutes: 60,
      sourceTimestamp: new Date('2024-01-01T01:00:00.000Z'),
      createdAt: new Date('2024-01-01T01:00:01.000Z')
    });

    const useCase = new GetActiveRoutesTrackingUseCase(repository, trackingAdapter, featureFlags);
    const result = await useCase.execute();

    expect(trackingAdapter.getTracking).toHaveBeenCalledWith(route);
    expect(repository.createTrackingSnapshot).toHaveBeenCalled();
    expect(result.data[0].tracking.lastLocation).toBe('Corredor logístico');
  });

  it('refreshes a stale snapshot instead of reusing it', async () => {
    featureFlags.isTrackingEnabled.mockReturnValue(true);
    repository.findActive.mockResolvedValue([route]);
    repository.findLatestTrackingSnapshot.mockResolvedValue({
      id: 9,
      routeId: 1,
      lastLocation: 'Ubicación antigua',
      latitude: 4.1,
      longitude: -74.3,
      progressPercent: 20,
      etaMinutes: 240,
      sourceTimestamp: new Date('2024-01-01T00:00:00.000Z'),
      createdAt: new Date(Date.now() - 61_000)
    });
    trackingAdapter.getTracking.mockResolvedValue({
      routeId: 1,
      lastLocation: 'Nueva ubicación',
      latitude: 4.8,
      longitude: -73.7,
      progressPercent: 72,
      etaMinutes: 60,
      sourceTimestamp: new Date('2024-01-01T01:00:00.000Z')
    });
    repository.createTrackingSnapshot.mockResolvedValue({
      id: 10,
      routeId: 1,
      lastLocation: 'Nueva ubicación',
      latitude: 4.8,
      longitude: -73.7,
      progressPercent: 72,
      etaMinutes: 60,
      sourceTimestamp: new Date('2024-01-01T01:00:00.000Z'),
      createdAt: new Date()
    });

    const useCase = new GetActiveRoutesTrackingUseCase(repository, trackingAdapter, featureFlags);
    const result = await useCase.execute();

    expect(trackingAdapter.getTracking).toHaveBeenCalledWith(route);
    expect(repository.createTrackingSnapshot).toHaveBeenCalled();
    expect(result.data[0].tracking.lastLocation).toBe('Nueva ubicación');
  });

  it('throws ForbiddenException when tracking feature flag is disabled', async () => {
    featureFlags.isTrackingEnabled.mockReturnValue(false);

    const useCase = new GetActiveRoutesTrackingUseCase(repository, trackingAdapter, featureFlags);

    await expect(useCase.execute()).rejects.toBeInstanceOf(ForbiddenException);
    expect(repository.findActive).not.toHaveBeenCalled();
  });
});
