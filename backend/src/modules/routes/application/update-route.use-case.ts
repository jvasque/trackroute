import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FeatureFlagsService } from '../../../config/feature-flags.service';
import { ROUTE_REPOSITORY, RouteRepository } from '../domain/route.repository';
import { RouteResponseDto, toRouteResponseDto } from '../dto/route-response.dto';
import { UpdateRouteInput } from '../schemas/update-route.schema';

@Injectable()
export class UpdateRouteUseCase {
  constructor(
    @Inject(ROUTE_REPOSITORY)
    private readonly routeRepository: RouteRepository,
    private readonly featureFlags: FeatureFlagsService
  ) {}

  async execute(id: number, input: UpdateRouteInput): Promise<RouteResponseDto> {
    if (!this.featureFlags.isRoutesUpdateEnabled()) {
      throw new ForbiddenException('Routes update feature is disabled');
    }

    const route = await this.routeRepository.findById(id);

    if (!route) {
      throw new NotFoundException('Route not found');
    }

    const updatedRoute = await this.routeRepository.update(id, input);

    return toRouteResponseDto(updatedRoute);
  }
}
