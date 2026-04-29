import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { FeatureFlagsService } from '../../../config/feature-flags.service';
import { RouteRepository } from '../domain/route.repository';
import { RouteStatus } from '../domain/route-status.enum';
import { UpdateRouteUseCase } from './update-route.use-case';

describe('UpdateRouteUseCase', () => {
  const repository: jest.Mocked<RouteRepository> = {
    findMany: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn()
  };

  const featureFlags: jest.Mocked<FeatureFlagsService> = {
    isRoutesReadEnabled: jest.fn(),
    isRoutesCreateEnabled: jest.fn(),
    isRoutesSeedEnabled: jest.fn(),
    isRoutesUpdateEnabled: jest.fn(),
    isRoutesSoftDeleteEnabled: jest.fn()
  } as unknown as jest.Mocked<FeatureFlagsService>;

  const now = new Date('2024-01-01T00:00:00.000Z');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('updates a route when feature flag is enabled and route exists', async () => {
    featureFlags.isRoutesUpdateEnabled.mockReturnValue(true);

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

    repository.findById.mockResolvedValue(currentRoute);
    repository.update.mockResolvedValue({
      ...currentRoute,
      carrier: 'Nuevo Transportista',
      updatedAt: new Date('2024-01-02T00:00:00.000Z')
    });

    const useCase = new UpdateRouteUseCase(repository, featureFlags);
    const result = await useCase.execute(1, { carrier: 'Nuevo Transportista' });

    expect(repository.findById).toHaveBeenCalledWith(1);
    expect(repository.update).toHaveBeenCalledWith(1, { carrier: 'Nuevo Transportista' });
    expect(result.carrier).toBe('Nuevo Transportista');
  });

  it('throws NotFoundException when route does not exist or is soft deleted', async () => {
    featureFlags.isRoutesUpdateEnabled.mockReturnValue(true);
    repository.findById.mockResolvedValue(null);

    const useCase = new UpdateRouteUseCase(repository, featureFlags);

    await expect(useCase.execute(999, { carrier: 'Nuevo' })).rejects.toBeInstanceOf(NotFoundException);
    expect(repository.update).not.toHaveBeenCalled();
  });

  it('throws ForbiddenException when update flag is disabled', async () => {
    featureFlags.isRoutesUpdateEnabled.mockReturnValue(false);

    const useCase = new UpdateRouteUseCase(repository, featureFlags);

    await expect(useCase.execute(1, { carrier: 'Nuevo' })).rejects.toBeInstanceOf(ForbiddenException);
    expect(repository.findById).not.toHaveBeenCalled();
    expect(repository.update).not.toHaveBeenCalled();
  });
});
