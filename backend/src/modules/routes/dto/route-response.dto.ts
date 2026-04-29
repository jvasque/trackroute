import { PaginatedRoutes, RouteEntity } from '../domain/route.entity';

export type RouteResponseDto = {
  id: number;
  originCity: string;
  destinationCity: string;
  distanceKm: number;
  estimatedTimeHours: number;
  vehicleType: string;
  carrier: string;
  costUsd: number;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type PaginatedRoutesResponseDto = {
  data: RouteResponseDto[];
  meta: PaginatedRoutes['meta'];
};

export function toRouteResponseDto(route: RouteEntity): RouteResponseDto {
  return {
    id: route.id,
    originCity: route.originCity,
    destinationCity: route.destinationCity,
    distanceKm: route.distanceKm,
    estimatedTimeHours: route.estimatedTimeHours,
    vehicleType: route.vehicleType,
    carrier: route.carrier,
    costUsd: route.costUsd,
    status: route.status,
    createdAt: route.createdAt.toISOString(),
    updatedAt: route.updatedAt.toISOString()
  };
}

export function toPaginatedRoutesResponseDto(result: PaginatedRoutes): PaginatedRoutesResponseDto {
  return {
    data: result.data.map(toRouteResponseDto),
    meta: result.meta
  };
}
