import { Module } from '@nestjs/common';
import { AppConfigModule } from '../../config/config.module';
import { CreateRouteUseCase } from './application/create-route.use-case';
import { ListRoutesUseCase } from './application/list-routes.use-case';
import { ROUTE_REPOSITORY } from './domain/route.repository';
import { PrismaRouteRepository } from './infrastructure/prisma-route.repository';
import { RoutesController } from './routes.controller';

@Module({
  imports: [AppConfigModule],
  controllers: [RoutesController],
  providers: [
    ListRoutesUseCase,
    CreateRouteUseCase,
    PrismaRouteRepository,
    {
      provide: ROUTE_REPOSITORY,
      useExisting: PrismaRouteRepository
    }
  ]
})
export class RoutesModule {}
