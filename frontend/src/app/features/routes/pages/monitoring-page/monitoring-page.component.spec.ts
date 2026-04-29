import { defer, of, throwError } from 'rxjs';
import { render, screen } from '@testing-library/angular';
import { FrontendFeatureFlagsService } from '../../../../core/config/feature-flags.service';
import { RoutesApiService } from '../../data-access/routes-api.service';
import { MonitoringPageComponent } from './monitoring-page.component';

describe('MonitoringPageComponent', () => {
  const trackingItem = {
    route: {
      id: 1,
      originCity: 'Bogotá',
      destinationCity: 'Cali',
      vehicleType: 'CAMION',
      carrier: 'TransAndes',
      status: 'ACTIVA' as const
    },
    tracking: {
      lastLocation: 'Corredor logístico',
      latitude: 4.61,
      longitude: -74.09,
      progressPercent: 68,
      etaMinutes: 80,
      sourceTimestamp: '2024-01-01T00:00:00.000Z',
      createdAt: '2024-01-01T00:00:10.000Z'
    }
  };

  const renderComponent = async (overrides?: {
    trackingEnabled?: boolean;
    getActiveRoutesTracking?: jasmine.Spy;
  }) => {
    const routesApi = {
      getActiveRoutesTracking: overrides?.getActiveRoutesTracking ?? jasmine.createSpy('getActiveRoutesTracking').and.returnValue(of({
        data: [trackingItem]
      }))
    };

    const featureFlags = {
      isRoutesListEnabled: jasmine.createSpy('isRoutesListEnabled').and.returnValue(true),
      isRoutesCreateEnabled: jasmine.createSpy('isRoutesCreateEnabled').and.returnValue(true),
      isTrackingEnabled: jasmine.createSpy('isTrackingEnabled').and.returnValue(overrides?.trackingEnabled ?? true)
    };

    const renderResult = await render(MonitoringPageComponent, {
      providers: [
        { provide: RoutesApiService, useValue: routesApi },
        { provide: FrontendFeatureFlagsService, useValue: featureFlags }
      ]
    });

    return { ...renderResult, routesApi };
  };

  afterEach(() => {
    // no-op
  });

  it('renders loading and then the monitoring table', async () => {
    const getActiveRoutesTracking = jasmine.createSpy('getActiveRoutesTracking').and.returnValue(
      defer(() => Promise.resolve({ data: [trackingItem] }))
    );

    await render(MonitoringPageComponent, {
      providers: [
        { provide: RoutesApiService, useValue: { getActiveRoutesTracking } },
        {
          provide: FrontendFeatureFlagsService,
          useValue: {
            isRoutesListEnabled: () => true,
            isRoutesCreateEnabled: () => true,
            isTrackingEnabled: () => true
          }
        }
      ]
    });

    expect(screen.getByText('Cargando monitoreo...')).toBeTruthy();

    expect(await screen.findByText('Corredor logístico')).toBeTruthy();
    expect(screen.getByText('1')).toBeTruthy();
  });

  it('shows empty state when there are no active routes to track', async () => {
    await renderComponent({
      getActiveRoutesTracking: jasmine.createSpy('getActiveRoutesTracking').and.returnValue(of({
        data: []
      }))
    });

    expect(await screen.findByText('No hay rutas activas para monitorear en este momento.')).toBeTruthy();
  });

  it('shows error state when tracking request fails', async () => {
    await renderComponent({
      getActiveRoutesTracking: jasmine.createSpy('getActiveRoutesTracking').and.returnValue(
        throwError(() => new Error('tracking down'))
      )
    });

    expect((await screen.findByRole('alert')).textContent).toContain('No fue posible cargar el monitoreo en tiempo real.');
  });

  it('polls the backend every 30 seconds', async () => {
    const setIntervalSpy = spyOn(window, 'setInterval').and.callThrough();

    await renderComponent();

    expect(await screen.findByText('Corredor logístico')).toBeTruthy();
    expect(setIntervalSpy).toHaveBeenCalled();
    expect(setIntervalSpy.calls.allArgs().some(([, delay]) => delay === 30_000)).toBeTrue();
  });

  it('shows disabled state when tracking feature flag is off', async () => {
    const { routesApi } = await renderComponent({ trackingEnabled: false });

    expect(screen.getByText('El monitoreo en tiempo real está deshabilitado.')).toBeTruthy();
    expect(routesApi.getActiveRoutesTracking).not.toHaveBeenCalled();
  });
});
