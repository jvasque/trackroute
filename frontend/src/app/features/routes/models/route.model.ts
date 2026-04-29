export type RouteStatus = 'ACTIVA' | 'INACTIVA' | 'SUSPENDIDA' | 'EN_MANTENIMIENTO';

export type RouteItem = {
  id: number;
  originCity: string;
  destinationCity: string;
  distanceKm: number;
  estimatedTimeHours: number;
  vehicleType: string;
  carrier: string;
  costUsd: number;
  status: RouteStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type RoutesQuery = {
  page: number;
  pageSize: number;
  originCity?: string;
  destinationCity?: string;
  vehicleType?: string;
  carrier?: string;
  status?: RouteStatus | '';
};

export type PaginatedRoutesResponse = {
  data: RouteItem[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

export type CreateRoutePayload = {
  originCity: string;
  destinationCity: string;
  distanceKm: number;
  estimatedTimeHours: number;
  vehicleType: string;
  carrier: string;
  costUsd: number;
  status: RouteStatus;
};

export type UpdateRoutePayload = Partial<CreateRoutePayload>;
