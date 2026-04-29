import { CreateRouteData, ListRoutesFilters, PaginatedRoutes, RouteEntity } from './route.entity';

export const ROUTE_REPOSITORY = Symbol('ROUTE_REPOSITORY');

export interface RouteRepository {
  findMany(filters: ListRoutesFilters): Promise<PaginatedRoutes>;
  create(data: CreateRouteData): Promise<RouteEntity>;
}
