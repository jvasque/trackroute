import { ForbiddenException } from '@nestjs/common';
import { FeatureFlagsService } from '../../../config/feature-flags.service';
import { RouteRepository } from '../domain/route.repository';
import { RouteStatus } from '../domain/route-status.enum';
import { CreateRouteUseCase } from './create-route.use-case';

describe('CreateRouteUseCase', () => {
  const repository: jest.Mocked<RouteRepository> = {
    findMany: jest.fn(),
    create: jest.fn()
  };

  const featureFlags: jest.Mocked<FeatureFlagsService> = {
    isRoutesReadEnabled: jest.fn(),
    isRoutesCreateEnabled: jest.fn(),
    isRoutesSeedEnabled: jest.fn()
  } as unknown as jest.Mocked<FeatureFlagsService>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates route when feature flag is enabled', async () => {
    featureFlags.isRoutesCreateEnabled.mockReturnValue(true);

    const now = new Date('2024-01-01T00:00:00.000Z');

    repository.create.mockResolvedValue({
      id: 10,
      originCity: 'Bogotá',
      destinationCity: 'Cali',
      distanceKm: 462,
      estimatedTimeHours: 9.5,
      vehicleType: 'CAMION',
      carrier: 'TransAndes',
      costUsd: 390,
      status: RouteStatus.ACTIVA,
      createdAt: now,
      updatedAt: now,
      deletedAt: null
    });

    const useCase = new CreateRouteUseCase(repository, featureFlags);

    const input = {
      originCity: 'Bogotá',
      destinationCity: 'Cali',
      distanceKm: 462,
      estimatedTimeHours: 9.5,
      vehicleType: 'CAMION',
      carrier: 'TransAndes',
      costUsd: 390,
      status: RouteStatus.ACTIVA
    };

    const result = await useCase.execute(input);

    expect(repository.create).toHaveBeenCalledWith(input);
    expect(result.id).toBe(10);
    expect(result.status).toBe(RouteStatus.ACTIVA);
  });

  it('throws ForbiddenException when feature flag is disabled', async () => {
    featureFlags.isRoutesCreateEnabled.mockReturnValue(false);

    const useCase = new CreateRouteUseCase(repository, featureFlags);

    await expect(
      useCase.execute({
        originCity: 'Bogotá',
        destinationCity: 'Cali',
        distanceKm: 462,
        estimatedTimeHours: 9.5,
        vehicleType: 'CAMION',
        carrier: 'TransAndes',
        costUsd: 390,
        status: RouteStatus.ACTIVA
      })
    ).rejects.toBeInstanceOf(ForbiddenException);

    expect(repository.create).not.toHaveBeenCalled();
  });
});
