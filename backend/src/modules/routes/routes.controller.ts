import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { ZodValidationPipe } from '../../common/validation/zod-validation.pipe';
import { CreateRouteUseCase } from './application/create-route.use-case';
import { ListRoutesUseCase } from './application/list-routes.use-case';
import { PaginatedRoutesResponseDto, RouteResponseDto } from './dto/route-response.dto';
import { createRouteSchema, CreateRouteInput } from './schemas/create-route.schema';
import { listRoutesQuerySchema, ListRoutesQuery } from './schemas/list-routes-query.schema';

@Controller('routes')
export class RoutesController {
  constructor(
    private readonly listRoutesUseCase: ListRoutesUseCase,
    private readonly createRouteUseCase: CreateRouteUseCase
  ) {}

  @Get()
  async list(
    @Query(new ZodValidationPipe(listRoutesQuerySchema))
    query: ListRoutesQuery
  ): Promise<PaginatedRoutesResponseDto> {
    return this.listRoutesUseCase.execute(query);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ZodValidationPipe(createRouteSchema))
    body: CreateRouteInput
  ): Promise<RouteResponseDto> {
    return this.createRouteUseCase.execute(body);
  }
}
