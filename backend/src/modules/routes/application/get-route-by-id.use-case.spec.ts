import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { FeatureFlagsService } from '../../../config/feature-flags.service';
import { RouteRepository } from '../domain/route.repository';
import { RouteStatus } from '../domain/route-status.enum';
import { GetRouteByIdUseCase } from './get-route-by-id.use-case';

describe('GetRouteByIdUseCase', () => {
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns one route when read flag is enabled and route exists', async () => {
    featureFlags.isRoutesReadEnabled.mockReturnValue(true);
    const now = new Date('2024-01-01T00:00:00.000Z');

    repository.findById.mockResolvedValue({
      id: 1,
      originCity: 'Bogotá',
      destinationCity: 'Medellín',
      distanceKm: 415,
      estimatedTimeHours: 8.5,
      vehicleType: 'CAMION',
      carrier: 'TCC',
      costUsd: 320,
      status: RouteStatus.ACTIVA,
      createdAt: now,
      updatedAt: now,
      deletedAt: null
    });

    const useCase = new GetRouteByIdUseCase(repository, featureFlags);
    const result = await useCase.execute(1);

    expect(repository.findById).toHaveBeenCalledWith(1);
    expect(result.id).toBe(1);
    expect(result.deletedAt).toBeNull();
  });

  it('throws NotFoundException when route does not exist or is soft deleted', async () => {
    featureFlags.isRoutesReadEnabled.mockReturnValue(true);
    repository.findById.mockResolvedValue(null);

    const useCase = new GetRouteByIdUseCase(repository, featureFlags);

    await expect(useCase.execute(999)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('throws ForbiddenException when read flag is disabled', async () => {
    featureFlags.isRoutesReadEnabled.mockReturnValue(false);

    const useCase = new GetRouteByIdUseCase(repository, featureFlags);

    await expect(useCase.execute(1)).rejects.toBeInstanceOf(ForbiddenException);
    expect(repository.findById).not.toHaveBeenCalled();
  });
});
