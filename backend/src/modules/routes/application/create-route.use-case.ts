import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { FeatureFlagsService } from '../../../config/feature-flags.service';
import { ROUTE_REPOSITORY, RouteRepository } from '../domain/route.repository';
import { RouteResponseDto, toRouteResponseDto } from '../dto/route-response.dto';
import { CreateRouteInput } from '../schemas/create-route.schema';

@Injectable()
export class CreateRouteUseCase {
  constructor(
    @Inject(ROUTE_REPOSITORY)
    private readonly routeRepository: RouteRepository,
    private readonly featureFlags: FeatureFlagsService
  ) {}

  async execute(input: CreateRouteInput): Promise<RouteResponseDto> {
    if (!this.featureFlags.isRoutesCreateEnabled()) {
      throw new ForbiddenException('Routes create feature is disabled');
    }

    const route = await this.routeRepository.create(input);
    return toRouteResponseDto(route);
  }
}
