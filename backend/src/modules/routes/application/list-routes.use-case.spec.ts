import { ForbiddenException } from '@nestjs/common';
import { FeatureFlagsService } from '../../../config/feature-flags.service';
import { RouteRepository } from '../domain/route.repository';
import { RouteStatus } from '../domain/route-status.enum';
import { ListRoutesUseCase } from './list-routes.use-case';

describe('ListRoutesUseCase', () => {
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

  it('returns paginated routes when feature flag is enabled', async () => {
    featureFlags.isRoutesReadEnabled.mockReturnValue(true);

    const now = new Date('2024-01-01T00:00:00.000Z');

    repository.findMany.mockResolvedValue({
      data: [
        {
          id: 1,
          originCity: 'Bogotá',
          destinationCity: 'Medellín',
          distanceKm: 420,
          estimatedTimeHours: 8.5,
          vehicleType: 'CAMION',
          carrier: 'TransAndes',
          costUsd: 320,
          status: RouteStatus.ACTIVA,
          createdAt: now,
          updatedAt: now,
          deletedAt: null
        }
      ],
      meta: {
        page: 1,
        pageSize: 20,
        total: 1,
        totalPages: 1
      }
    });

    const useCase = new ListRoutesUseCase(repository, featureFlags);
    const result = await useCase.execute({ page: 1, pageSize: 20 });

    expect(repository.findMany).toHaveBeenCalledWith({ page: 1, pageSize: 20 });
    expect(result.meta.total).toBe(1);
    expect(result.data[0].originCity).toBe('Bogotá');
    expect(result.data[0].deletedAt).toBeNull();
  });

  it('throws ForbiddenException when feature flag is disabled', async () => {
    featureFlags.isRoutesReadEnabled.mockReturnValue(false);

    const useCase = new ListRoutesUseCase(repository, featureFlags);

    await expect(useCase.execute({ page: 1, pageSize: 20 })).rejects.toBeInstanceOf(ForbiddenException);
    expect(repository.findMany).not.toHaveBeenCalled();
  });
});
