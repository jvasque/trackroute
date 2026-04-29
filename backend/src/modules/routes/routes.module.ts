import { Module } from '@nestjs/common';
import { AppConfigModule } from '../../config/config.module';
import { CreateRouteUseCase } from './application/create-route.use-case';
import { GetRouteByIdUseCase } from './application/get-route-by-id.use-case';
import { ListRoutesUseCase } from './application/list-routes.use-case';
import { SoftDeleteRouteUseCase } from './application/soft-delete-route.use-case';
import { UpdateRouteUseCase } from './application/update-route.use-case';
import { ROUTE_REPOSITORY } from './domain/route.repository';
import { PrismaRouteRepository } from './infrastructure/prisma-route.repository';
import { RoutesController } from './routes.controller';

@Module({
  imports: [AppConfigModule],
  controllers: [RoutesController],
  providers: [
    ListRoutesUseCase,
    CreateRouteUseCase,
    GetRouteByIdUseCase,
    UpdateRouteUseCase,
    SoftDeleteRouteUseCase,
    PrismaRouteRepository,
    {
      provide: ROUTE_REPOSITORY,
      useExisting: PrismaRouteRepository
    }
  ]
})
export class RoutesModule {}
