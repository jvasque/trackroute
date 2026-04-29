import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { FeatureFlagsService } from '../../../config/feature-flags.service';
import { RouteRepository } from '../domain/route.repository';
import { RouteStatus } from '../domain/route-status.enum';
import { SoftDeleteRouteUseCase } from './soft-delete-route.use-case';

describe('SoftDeleteRouteUseCase', () => {
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

  const now = new Date('2024-01-01T00:00:00.000Z');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('soft deletes a route, sets deletedAt and status INACTIVA', async () => {
    featureFlags.isRoutesSoftDeleteEnabled.mockReturnValue(true);

    const currentRoute = {
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
    };

    const deletedAt = new Date('2024-01-02T00:00:00.000Z');

    repository.findById.mockResolvedValue(currentRoute);
    repository.softDelete.mockResolvedValue({
      ...currentRoute,
      status: RouteStatus.INACTIVA,
      updatedAt: deletedAt,
      deletedAt
    });

    const useCase = new SoftDeleteRouteUseCase(repository, featureFlags);
    const result = await useCase.execute(1);

    expect(repository.findById).toHaveBeenCalledWith(1);
    expect(repository.softDelete).toHaveBeenCalledWith(1);
    expect(result.status).toBe(RouteStatus.INACTIVA);
    expect(result.deletedAt).toBe('2024-01-02T00:00:00.000Z');
  });

  it('throws NotFoundException when route does not exist or is already soft deleted', async () => {
    featureFlags.isRoutesSoftDeleteEnabled.mockReturnValue(true);
    repository.findById.mockResolvedValue(null);

    const useCase = new SoftDeleteRouteUseCase(repository, featureFlags);

    await expect(useCase.execute(999)).rejects.toBeInstanceOf(NotFoundException);
    expect(repository.softDelete).not.toHaveBeenCalled();
  });

  it('throws ForbiddenException when soft delete flag is disabled', async () => {
    featureFlags.isRoutesSoftDeleteEnabled.mockReturnValue(false);

    const useCase = new SoftDeleteRouteUseCase(repository, featureFlags);

    await expect(useCase.execute(1)).rejects.toBeInstanceOf(ForbiddenException);
    expect(repository.findById).not.toHaveBeenCalled();
    expect(repository.softDelete).not.toHaveBeenCalled();
  });
});
