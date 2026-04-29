import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { FeatureFlagsService } from '../../../config/feature-flags.service';
import { ROUTE_REPOSITORY, RouteRepository } from '../domain/route.repository';
import { PaginatedRoutesResponseDto, toPaginatedRoutesResponseDto } from '../dto/route-response.dto';
import { ListRoutesQuery } from '../schemas/list-routes-query.schema';

@Injectable()
export class ListRoutesUseCase {
  constructor(
    @Inject(ROUTE_REPOSITORY)
    private readonly routeRepository: RouteRepository,
    private readonly featureFlags: FeatureFlagsService
  ) {}

  async execute(query: ListRoutesQuery): Promise<PaginatedRoutesResponseDto> {
    if (!this.featureFlags.isRoutesReadEnabled()) {
      throw new ForbiddenException('Routes read feature is disabled');
    }

    const result = await this.routeRepository.findMany(query);
    return toPaginatedRoutesResponseDto(result);
  }
}
