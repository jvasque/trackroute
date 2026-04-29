import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FeatureFlagsService } from '../../../config/feature-flags.service';
import { ROUTE_REPOSITORY, RouteRepository } from '../domain/route.repository';
import { RouteResponseDto, toRouteResponseDto } from '../dto/route-response.dto';

@Injectable()
export class GetRouteByIdUseCase {
  constructor(
    @Inject(ROUTE_REPOSITORY)
    private readonly routeRepository: RouteRepository,
    private readonly featureFlags: FeatureFlagsService
  ) {}

  async execute(id: number): Promise<RouteResponseDto> {
    if (!this.featureFlags.isRoutesReadEnabled()) {
      throw new ForbiddenException('Routes read feature is disabled');
    }

    const route = await this.routeRepository.findById(id);

    if (!route) {
      throw new NotFoundException('Route not found');
    }

    return toRouteResponseDto(route);
  }
}
