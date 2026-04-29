import { CommonModule } from '@angular/common';
import { ApplicationRef, ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { FrontendFeatureFlagsService } from '../../../../core/config/feature-flags.service';
import { RouteFormComponent, RouteFormMode, RouteFormValue } from '../../components/route-form/route-form.component';
import { RoutesApiService } from '../../data-access/routes-api.service';
import { PaginatedRoutesResponse, RouteItem, RouteStatus, RoutesQuery } from '../../models/route.model';

@Component({
  selector: 'app-routes-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouteFormComponent],
  templateUrl: './routes-page.component.html',
  styleUrl: './routes-page.component.css'
})
export class RoutesPageComponent implements OnInit, OnDestroy {
  private readonly appRef = inject(ApplicationRef);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly routesApi = inject(RoutesApiService);
  private readonly featureFlags = inject(FrontendFeatureFlagsService);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly ngZone = inject(NgZone);
  private successMessageTimeout: ReturnType<typeof setTimeout> | undefined;

  @ViewChild(RouteFormComponent) private routeForm?: RouteFormComponent;

  readonly statuses: Array<RouteStatus | ''> = ['', 'ACTIVA', 'INACTIVA', 'SUSPENDIDA', 'EN_MANTENIMIENTO'];

  readonly filtersForm = this.formBuilder.group({
    originCity: [''],
    destinationCity: [''],
    vehicleType: [''],
    carrier: [''],
    status: ['' as RouteStatus | '']
  });

  routes: RouteItem[] = [];
  selectedRoute: RouteItem | null = null;
  formMode: RouteFormMode = 'create';
  page = 1;
  readonly pageSize = 10;
  total = 0;
  totalPages = 0;

  loading = false;
  saving = false;
  deletingRouteId: number | null = null;
  errorMessage = '';
  toastMessage = '';
  toastTone: 'success' | 'error' = 'success';

  readonly listEnabled = this.featureFlags.isRoutesListEnabled();
  readonly createEnabled = this.featureFlags.isRoutesCreateEnabled();
  readonly writeRequiresAdmin = true;

  ngOnInit(): void {
    this.loadRoutes();
  }

  ngOnDestroy(): void {
    this.clearToastTimeout();
  }

  loadRoutes(page = this.page): void {
    if (!this.listEnabled) {
      this.routes = [];
      this.errorMessage = 'El listado de rutas está deshabilitado por feature flag.';
      return;
    }

    this.page = page;
    this.loading = true;
    this.errorMessage = '';

    this.routesApi
      .listRoutes(this.buildQuery())
      .pipe(finalize(() => {
        this.ngZone.run(() => {
          this.loading = false;
          this.debugUi('listRoutes.finalize', { page: this.page, total: this.total, loading: this.loading });
          this.flushView();
        });
      }))
      .subscribe({
        next: (response) => {
          this.ngZone.run(() => {
            this.applyResponse(response);
            this.debugUi('listRoutes.next', {
              page: response.meta.page,
              total: response.meta.total,
              totalPages: response.meta.totalPages,
              rows: response.data.length
            });
            this.flushView();
          });
        },
        error: () => {
          this.ngZone.run(() => {
            this.routes = [];
            this.total = 0;
            this.totalPages = 0;
            this.errorMessage = 'No fue posible cargar las rutas. Verifica que el backend esté corriendo.';
            this.debugUi('listRoutes.error', { loading: this.loading });
            this.flushView();
          });
        }
      });
  }

  applyFilters(): void {
    this.loadRoutes(1);
  }

  clearFilters(): void {
    this.filtersForm.reset({
      originCity: '',
      destinationCity: '',
      vehicleType: '',
      carrier: '',
      status: ''
    });
    this.loadRoutes(1);
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.loadRoutes(this.page + 1);
    }
  }

  previousPage(): void {
    if (this.page > 1) {
      this.loadRoutes(this.page - 1);
    }
  }

  saveRoute(payload: RouteFormValue): void {
    if (!this.createEnabled) {
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.clearToast();

    const request$ = this.formMode === 'edit' && this.selectedRoute
      ? this.routesApi.updateRoute(this.selectedRoute.id, payload)
      : this.routesApi.createRoute(payload);

    request$
      .pipe(finalize(() => {
        this.ngZone.run(() => {
          this.saving = false;
          this.debugUi('saveRoute.finalize', { mode: this.formMode, saving: this.saving });
          this.flushView();
        });
      }))
      .subscribe({
        next: () => {
          this.ngZone.run(() => {
            this.routeForm?.reset();
            if (this.formMode === 'edit') {
              this.showToast('Ruta actualizada exitosamente.', 'success');
            } else {
              this.showToast('Ruta creada exitosamente.', 'success');
            }
            this.cancelEdit();
            this.debugUi('saveRoute.next', { mode: this.formMode, selectedRouteId: this.selectedRoute?.id ?? null });
            this.loadRoutes(1);
          });
        },
        error: () => {
          this.ngZone.run(() => {
            this.showToast(
              this.formMode === 'edit'
                ? 'No fue posible actualizar la ruta. Revisa los datos e intenta nuevamente.'
                : 'No fue posible crear la ruta. Revisa los datos e intenta nuevamente.',
              'error'
            );
            this.debugUi('saveRoute.error', { mode: this.formMode });
            this.flushView();
          });
        }
      });
  }

  startEdit(route: RouteItem): void {
    this.selectedRoute = route;
    this.formMode = 'edit';
    this.clearToast();
    this.debugUi('startEdit', { routeId: route.id });
    this.flushView();
  }

  cancelEdit(): void {
    this.selectedRoute = null;
    this.formMode = 'create';
    this.routeForm?.reset();
    this.debugUi('cancelEdit');
    this.flushView();
  }

  disableRoute(route: RouteItem): void {
    if (!this.createEnabled || this.deletingRouteId !== null) {
      return;
    }

    const confirmed = window.confirm(`¿Deseas inhabilitar la ruta ${route.id} (${route.originCity} -> ${route.destinationCity})?`);

    if (!confirmed) {
      return;
    }

    this.deletingRouteId = route.id;
    this.errorMessage = '';
    this.clearToast();

    this.routesApi
      .softDeleteRoute(route.id)
      .pipe(finalize(() => {
        this.ngZone.run(() => {
          this.deletingRouteId = null;
          this.debugUi('disableRoute.finalize', { routeId: route.id });
          this.flushView();
        });
      }))
      .subscribe({
        next: () => {
          this.ngZone.run(() => {
            if (this.selectedRoute?.id === route.id) {
              this.cancelEdit();
            }
            this.showToast('Ruta inhabilitada exitosamente.', 'success');
            this.debugUi('disableRoute.next', { routeId: route.id });
            this.loadRoutes(1);
          });
        },
        error: () => {
          this.ngZone.run(() => {
            this.showToast('No fue posible inhabilitar la ruta. Intenta nuevamente.', 'error');
            this.debugUi('disableRoute.error', { routeId: route.id });
            this.flushView();
          });
        }
      });
  }

  isDeleting(routeId: number): boolean {
    return this.deletingRouteId === routeId;
  }

  private buildQuery(): RoutesQuery {
    const filters = this.filtersForm.getRawValue();

    return {
      page: this.page,
      pageSize: this.pageSize,
      originCity: this.clean(filters.originCity),
      destinationCity: this.clean(filters.destinationCity),
      vehicleType: this.clean(filters.vehicleType),
      carrier: this.clean(filters.carrier),
      status: filters.status || ''
    };
  }

  private clean(value: string): string | undefined {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  private applyResponse(response: PaginatedRoutesResponse): void {
    this.routes = response.data;
    this.page = response.meta.page;
    this.total = response.meta.total;
    this.totalPages = response.meta.totalPages;
  }

  private showToast(message: string, tone: 'success' | 'error'): void {
    this.toastMessage = message;
    this.toastTone = tone;
    this.clearToastTimeout();
    this.successMessageTimeout = setTimeout(() => {
      this.ngZone.run(() => {
        this.toastMessage = '';
        this.successMessageTimeout = undefined;
        this.debugUi('toast.timeout');
        this.flushView();
      });
    }, 3500);
    this.flushView();
  }

  private clearToast(): void {
    this.toastMessage = '';
    this.clearToastTimeout();
    this.flushView();
  }

  private clearToastTimeout(): void {
    if (this.successMessageTimeout) {
      clearTimeout(this.successMessageTimeout);
      this.successMessageTimeout = undefined;
    }
  }

  private flushView(): void {
    queueMicrotask(() => {
      this.changeDetectorRef.detectChanges();
      this.appRef.tick();
    });
  }

  private debugUi(event: string, payload?: Record<string, unknown>): void {
    console.debug('[RoutesPageComponent]', event, {
      inAngularZone: NgZone.isInAngularZone(),
      loading: this.loading,
      saving: this.saving,
      deletingRouteId: this.deletingRouteId,
      formMode: this.formMode,
      selectedRouteId: this.selectedRoute?.id ?? null,
      total: this.total,
      rows: this.routes.length,
      ...payload
    });
  }
}
