import { Injectable } from '@nestjs/common';
import { Prisma, RouteStatus as PrismaRouteStatus } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import {
  CreateRouteTrackingSnapshotData,
  CreateRouteData,
  ListRoutesFilters,
  PaginatedRoutes,
  RouteEntity,
  RouteTrackingSnapshotEntity,
  UpdateRouteData
} from '../domain/route.entity';
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

  async findById(id: number): Promise<RouteEntity | null> {
    const route = await this.prisma.route.findFirst({
      where: {
        id,
        deletedAt: null
      }
    });

    return route ? this.toEntity(route) : null;
  }

  async findActive(): Promise<RouteEntity[]> {
    const routes = await this.prisma.route.findMany({
      where: {
        deletedAt: null,
        status: PrismaRouteStatus.ACTIVA
      },
      orderBy: { createdAt: 'desc' }
    });

    return routes.map(this.toEntity);
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

  async update(id: number, data: UpdateRouteData): Promise<RouteEntity> {
    const updated = await this.prisma.route.update({
      where: { id },
      data: {
        ...(data.originCity !== undefined && { originCity: data.originCity }),
        ...(data.destinationCity !== undefined && { destinationCity: data.destinationCity }),
        ...(data.distanceKm !== undefined && { distanceKm: data.distanceKm }),
        ...(data.estimatedTimeHours !== undefined && { estimatedTimeHours: data.estimatedTimeHours }),
        ...(data.vehicleType !== undefined && { vehicleType: data.vehicleType }),
        ...(data.carrier !== undefined && { carrier: data.carrier }),
        ...(data.costUsd !== undefined && { costUsd: data.costUsd }),
        ...(data.status !== undefined && { status: data.status as PrismaRouteStatus })
      }
    });

    return this.toEntity(updated);
  }

  async softDelete(id: number): Promise<RouteEntity> {
    const deleted = await this.prisma.route.update({
      where: { id },
      data: {
        status: PrismaRouteStatus.INACTIVA,
        deletedAt: new Date()
      }
    });

    return this.toEntity(deleted);
  }

  async findLatestTrackingSnapshot(routeId: number): Promise<RouteTrackingSnapshotEntity | null> {
    const snapshot = await this.prisma.routeTrackingSnapshot.findFirst({
      where: { routeId },
      orderBy: { createdAt: 'desc' }
    });

    return snapshot ? this.toTrackingSnapshotEntity(snapshot) : null;
  }

  async createTrackingSnapshot(data: CreateRouteTrackingSnapshotData): Promise<RouteTrackingSnapshotEntity> {
    const snapshot = await this.prisma.routeTrackingSnapshot.create({
      data: {
        routeId: data.routeId,
        lastLocation: data.lastLocation,
        latitude: data.latitude,
        longitude: data.longitude,
        progressPercent: data.progressPercent,
        etaMinutes: data.etaMinutes,
        sourceTimestamp: data.sourceTimestamp
      }
    });

    return this.toTrackingSnapshotEntity(snapshot);
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

  private toTrackingSnapshotEntity(snapshot: {
    id: number;
    routeId: number;
    lastLocation: string;
    latitude: number | null;
    longitude: number | null;
    progressPercent: number;
    etaMinutes: number;
    sourceTimestamp: Date;
    createdAt: Date;
  }): RouteTrackingSnapshotEntity {
    return {
      id: snapshot.id,
      routeId: snapshot.routeId,
      lastLocation: snapshot.lastLocation,
      latitude: snapshot.latitude,
      longitude: snapshot.longitude,
      progressPercent: snapshot.progressPercent,
      etaMinutes: snapshot.etaMinutes,
      sourceTimestamp: snapshot.sourceTimestamp,
      createdAt: snapshot.createdAt
    };
  }
}
