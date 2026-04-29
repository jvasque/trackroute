import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FeatureFlagsService } from '../../../config/feature-flags.service';
import { ROUTE_REPOSITORY, RouteRepository } from '../domain/route.repository';
import { RouteResponseDto, toRouteResponseDto } from '../dto/route-response.dto';

@Injectable()
export class SoftDeleteRouteUseCase {
  constructor(
    @Inject(ROUTE_REPOSITORY)
    private readonly routeRepository: RouteRepository,
    private readonly featureFlags: FeatureFlagsService
  ) {}

  async execute(id: number): Promise<RouteResponseDto> {
    if (!this.featureFlags.isRoutesSoftDeleteEnabled()) {
      throw new ForbiddenException('Routes soft delete feature is disabled');
    }

    const route = await this.routeRepository.findById(id);

    if (!route) {
      throw new NotFoundException('Route not found');
    }

    const deletedRoute = await this.routeRepository.softDelete(id);

    return toRouteResponseDto(deletedRoute);
  }
}
