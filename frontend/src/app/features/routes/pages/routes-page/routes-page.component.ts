import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { FrontendFeatureFlagsService } from '../../../../core/config/feature-flags.service';
import { RouteFormComponent } from '../../components/route-form/route-form.component';
import { RoutesApiService } from '../../data-access/routes-api.service';
import { CreateRoutePayload, PaginatedRoutesResponse, RouteItem, RouteStatus, RoutesQuery } from '../../models/route.model';

@Component({
  selector: 'app-routes-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouteFormComponent],
  templateUrl: './routes-page.component.html',
  styleUrl: './routes-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoutesPageComponent implements OnInit, OnDestroy {
  private readonly routesApi = inject(RoutesApiService);
  private readonly featureFlags = inject(FrontendFeatureFlagsService);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private activeRequestId = 0;
  private successMessageTimeout: ReturnType<typeof setTimeout> | undefined;
  private viewRefreshQueued = false;
  private destroyed = false;

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
  page = 1;
  readonly pageSize = 10;
  total = 0;
  totalPages = 0;

  loading = false;
  creating = false;
  errorMessage = '';
  successMessage = '';

  readonly listEnabled = this.featureFlags.isRoutesListEnabled();
  readonly createEnabled = this.featureFlags.isRoutesCreateEnabled();

  ngOnInit(): void {
    this.loadRoutes();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.clearSuccessMessageTimeout();
  }

  loadRoutes(page = this.page): void {
    if (!this.listEnabled) {
      this.routes = [];
      this.errorMessage = 'El listado de rutas está deshabilitado por feature flag.';
      this.requestViewUpdate();
      return;
    }

    const requestId = ++this.activeRequestId;
    this.page = page;
    this.loading = true;
    this.errorMessage = '';

    this.routesApi
      .listRoutes(this.buildQuery())
      .pipe(finalize(() => {
        if (requestId === this.activeRequestId) {
          this.loading = false;
          this.requestViewUpdate();
        }
      }))
      .subscribe({
        next: (response) => {
          if (requestId !== this.activeRequestId) {
            return;
          }

          this.applyResponse(response);
          this.requestViewUpdate();
        },
        error: () => {
          if (requestId !== this.activeRequestId) {
            return;
          }

          this.routes = [];
          this.total = 0;
          this.totalPages = 0;
          this.errorMessage = 'No fue posible cargar las rutas. Verifica que el backend esté corriendo.';
          this.requestViewUpdate();
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

  createRoute(payload: CreateRoutePayload): void {
    if (!this.createEnabled) {
      return;
    }

    this.creating = true;
    this.errorMessage = '';
    this.clearSuccessMessage();

    this.routesApi
      .createRoute(payload)
      .pipe(finalize(() => {
        this.creating = false;
        this.requestViewUpdate();
      }))
      .subscribe({
        next: () => {
          this.routeForm?.reset();
          this.showSuccessMessage('Ruta creada exitosamente.');
          this.loadRoutes(1);
        },
        error: () => {
          this.errorMessage = 'No fue posible crear la ruta. Revisa los datos e intenta nuevamente.';
          this.requestViewUpdate();
        }
      });
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

  private showSuccessMessage(message: string): void {
    this.successMessage = message;
    this.clearSuccessMessageTimeout();
    this.successMessageTimeout = setTimeout(() => {
      this.successMessage = '';
      this.successMessageTimeout = undefined;
      this.requestViewUpdate();
    }, 3500);
    this.requestViewUpdate();
  }

  private clearSuccessMessage(): void {
    this.successMessage = '';
    this.clearSuccessMessageTimeout();
    this.requestViewUpdate();
  }

  private clearSuccessMessageTimeout(): void {
    if (this.successMessageTimeout) {
      clearTimeout(this.successMessageTimeout);
      this.successMessageTimeout = undefined;
    }
  }

  private requestViewUpdate(): void {
    if (this.viewRefreshQueued || this.destroyed) {
      return;
    }

    this.viewRefreshQueued = true;
    queueMicrotask(() => {
      this.viewRefreshQueued = false;

      if (!this.destroyed) {
        this.changeDetector.detectChanges();
      }
    });
  }
}
