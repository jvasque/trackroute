import {
  CreateRouteData,
  ListRoutesFilters,
  PaginatedRoutes,
  RouteEntity,
  UpdateRouteData
} from './route.entity';

export const ROUTE_REPOSITORY = Symbol('ROUTE_REPOSITORY');

export interface RouteRepository {
  findMany(filters: ListRoutesFilters): Promise<PaginatedRoutes>;
  findById(id: number): Promise<RouteEntity | null>;
  create(data: CreateRouteData): Promise<RouteEntity>;
  update(id: number, data: UpdateRouteData): Promise<RouteEntity>;
  softDelete(id: number): Promise<RouteEntity>;
}
