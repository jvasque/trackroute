import { RouteStatus } from './route-status.enum';

export type RouteEntity = {
  id: number;
  originCity: string;
  destinationCity: string;
  distanceKm: number;
  estimatedTimeHours: number;
  vehicleType: string;
  carrier: string;
  costUsd: number;
  status: RouteStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type CreateRouteData = {
  originCity: string;
  destinationCity: string;
  distanceKm: number;
  estimatedTimeHours: number;
  vehicleType: string;
  carrier: string;
  costUsd: number;
  status: RouteStatus;
};

export type UpdateRouteData = Partial<CreateRouteData>;

export type ListRoutesFilters = {
  page: number;
  pageSize: number;
  originCity?: string;
  destinationCity?: string;
  vehicleType?: string;
  carrier?: string;
  status?: RouteStatus;
};

export type PaginatedRoutes = {
  data: RouteEntity[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

export type RouteTrackingSnapshotEntity = {
  id: number;
  routeId: number;
  lastLocation: string;
  latitude: number | null;
  longitude: number | null;
  progressPercent: number;
  etaMinutes: number;
  sourceTimestamp: Date;
  createdAt: Date;
};

export type CreateRouteTrackingSnapshotData = Omit<RouteTrackingSnapshotEntity, 'id' | 'createdAt'>;
