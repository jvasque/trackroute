import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ZodValidationPipe } from '../../common/validation/zod-validation.pipe';
import { CreateRouteUseCase } from './application/create-route.use-case';
import { GetRouteByIdUseCase } from './application/get-route-by-id.use-case';
import { ListRoutesUseCase } from './application/list-routes.use-case';
import { SoftDeleteRouteUseCase } from './application/soft-delete-route.use-case';
import { UpdateRouteUseCase } from './application/update-route.use-case';
import { PaginatedRoutesResponseDto, RouteResponseDto } from './dto/route-response.dto';
import { createRouteSchema, CreateRouteInput } from './schemas/create-route.schema';
import { listRoutesQuerySchema, ListRoutesQuery } from './schemas/list-routes-query.schema';
import { routeIdParamSchema, RouteIdParam } from './schemas/route-id-param.schema';
import { updateRouteSchema, UpdateRouteInput } from './schemas/update-route.schema';

@Controller('routes')
export class RoutesController {
  constructor(
    private readonly listRoutesUseCase: ListRoutesUseCase,
    private readonly createRouteUseCase: CreateRouteUseCase,
    private readonly getRouteByIdUseCase: GetRouteByIdUseCase,
    private readonly updateRouteUseCase: UpdateRouteUseCase,
    private readonly softDeleteRouteUseCase: SoftDeleteRouteUseCase
  ) {}

  @Get()
  async list(
    @Query(new ZodValidationPipe(listRoutesQuerySchema))
    query: ListRoutesQuery
  ): Promise<PaginatedRoutesResponseDto> {
    return this.listRoutesUseCase.execute(query);
  }

  @Get(':id')
  async getById(
    @Param(new ZodValidationPipe(routeIdParamSchema))
    params: RouteIdParam
  ): Promise<RouteResponseDto> {
    return this.getRouteByIdUseCase.execute(params.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ZodValidationPipe(createRouteSchema))
    body: CreateRouteInput
  ): Promise<RouteResponseDto> {
    return this.createRouteUseCase.execute(body);
  }

  @Patch(':id')
  async update(
    @Param(new ZodValidationPipe(routeIdParamSchema))
    params: RouteIdParam,
    @Body(new ZodValidationPipe(updateRouteSchema))
    body: UpdateRouteInput
  ): Promise<RouteResponseDto> {
    return this.updateRouteUseCase.execute(params.id, body);
  }

  @Delete(':id')
  async softDelete(
    @Param(new ZodValidationPipe(routeIdParamSchema))
    params: RouteIdParam
  ): Promise<RouteResponseDto> {
    return this.softDeleteRouteUseCase.execute(params.id);
  }
}
