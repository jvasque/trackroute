import { Injectable } from '@nestjs/common';
import { Prisma, RouteStatus as PrismaRouteStatus } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { CreateRouteData, ListRoutesFilters, PaginatedRoutes, RouteEntity } from '../domain/route.entity';
import { RouteRepository } from '../domain/route.repository';
import { RouteStatus } from '../domain/route-status.enum';

@Injectable()
export class PrismaRouteRepository implements RouteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(filters: ListRoutesFilters): Promise<PaginatedRoutes> {
    const where = this.buildWhere(filters);
    const skip = (filters.page - 1) * filters.pageSize;
    const take = filters.pageSize;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.route.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take
      }),
      this.prisma.route.count({ where })
    ]);

    return {
      data: data.map(this.toEntity),
      meta: {
        page: filters.page,
        pageSize: filters.pageSize,
        total,
        totalPages: Math.ceil(total / filters.pageSize)
      }
    };
  }

  async create(data: CreateRouteData): Promise<RouteEntity> {
    const created = await this.prisma.route.create({
      data: {
        originCity: data.originCity,
        destinationCity: data.destinationCity,
        distanceKm: data.distanceKm,
        estimatedTimeHours: data.estimatedTimeHours,
        vehicleType: data.vehicleType,
        carrier: data.carrier,
        costUsd: data.costUsd,
        status: data.status as PrismaRouteStatus
      }
    });

    return this.toEntity(created);
  }

  private buildWhere(filters: ListRoutesFilters): Prisma.RouteWhereInput {
    return {
      deletedAt: null,
      ...(filters.originCity && {
        originCity: { contains: filters.originCity }
      }),
      ...(filters.destinationCity && {
        destinationCity: { contains: filters.destinationCity }
      }),
      ...(filters.vehicleType && {
        vehicleType: { contains: filters.vehicleType }
      }),
      ...(filters.carrier && {
        carrier: { contains: filters.carrier }
      }),
      ...(filters.status && {
        status: filters.status as PrismaRouteStatus
      })
    };
  }

  private toEntity(route: {
    id: number;
    originCity: string;
    destinationCity: string;
    distanceKm: number;
    estimatedTimeHours: number;
    vehicleType: string;
    carrier: string;
    costUsd: number;
    status: PrismaRouteStatus;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  }): RouteEntity {
    return {
      id: route.id,
      originCity: route.originCity,
      destinationCity: route.destinationCity,
      distanceKm: route.distanceKm,
      estimatedTimeHours: route.estimatedTimeHours,
      vehicleType: route.vehicleType,
      carrier: route.carrier,
      costUsd: route.costUsd,
      status: route.status as RouteStatus,
      createdAt: route.createdAt,
      updatedAt: route.updatedAt,
      deletedAt: route.deletedAt
    };
  }
}
