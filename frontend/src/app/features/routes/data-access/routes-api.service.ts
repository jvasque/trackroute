import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  ActiveRoutesTrackingResponse,
  CreateRoutePayload,
  PaginatedRoutesResponse,
  RouteItem,
  RoutesQuery,
  UpdateRoutePayload
} from '../models/route.model';

@Injectable({
  providedIn: 'root'
})
export class RoutesApiService {
  private readonly baseUrl = `${environment.apiBaseUrl}/routes`;

  constructor(private readonly http: HttpClient) {}

  listRoutes(query: RoutesQuery): Observable<PaginatedRoutesResponse> {
    let params = new HttpParams()
      .set('page', query.page)
      .set('pageSize', query.pageSize);

    if (query.originCity) {
      params = params.set('originCity', query.originCity);
    }

    if (query.destinationCity) {
      params = params.set('destinationCity', query.destinationCity);
    }

    if (query.vehicleType) {
      params = params.set('vehicleType', query.vehicleType);
    }

    if (query.carrier) {
      params = params.set('carrier', query.carrier);
    }

    if (query.status) {
      params = params.set('status', query.status);
    }

    return this.http.get<PaginatedRoutesResponse>(this.baseUrl, { params });
  }

  createRoute(payload: CreateRoutePayload): Observable<RouteItem> {
    return this.http.post<RouteItem>(this.baseUrl, payload);
  }

  updateRoute(id: number, payload: UpdateRoutePayload): Observable<RouteItem> {
    return this.http.patch<RouteItem>(`${this.baseUrl}/${id}`, payload);
  }

  softDeleteRoute(id: number): Observable<RouteItem> {
    return this.http.delete<RouteItem>(`${this.baseUrl}/${id}`);
  }

  getActiveRoutesTracking(): Observable<ActiveRoutesTrackingResponse> {
    return this.http.get<ActiveRoutesTrackingResponse>(`${this.baseUrl}/active/tracking`);
  }
}
