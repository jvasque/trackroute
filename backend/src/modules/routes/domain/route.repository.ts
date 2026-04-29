import {
  CreateRouteTrackingSnapshotData,
  CreateRouteData,
  ListRoutesFilters,
  PaginatedRoutes,
  RouteEntity,
  RouteTrackingSnapshotEntity,
  UpdateRouteData
} from './route.entity';

export const ROUTE_REPOSITORY = Symbol('ROUTE_REPOSITORY');

export interface RouteRepository {
  findMany(filters: ListRoutesFilters): Promise<PaginatedRoutes>;
  findActive(): Promise<RouteEntity[]>;
  findById(id: number): Promise<RouteEntity | null>;
  create(data: CreateRouteData): Promise<RouteEntity>;
  update(id: number, data: UpdateRouteData): Promise<RouteEntity>;
  softDelete(id: number): Promise<RouteEntity>;
  findLatestTrackingSnapshot(routeId: number): Promise<RouteTrackingSnapshotEntity | null>;
  createTrackingSnapshot(data: CreateRouteTrackingSnapshotData): Promise<RouteTrackingSnapshotEntity>;
}
