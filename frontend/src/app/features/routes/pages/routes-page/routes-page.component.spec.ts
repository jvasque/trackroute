import { Subject, of, throwError } from 'rxjs';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { FrontendFeatureFlagsService } from '../../../../core/config/feature-flags.service';
import { RoutesApiService } from '../../data-access/routes-api.service';
import { RoutesPageComponent } from './routes-page.component';

describe('RoutesPageComponent', () => {
  const route = {
    id: 1,
    originCity: 'Bogotá',
    destinationCity: 'Cali',
    distanceKm: 462,
    estimatedTimeHours: 9.5,
    vehicleType: 'CAMION',
    carrier: 'TransAndes',
    costUsd: 390,
    status: 'ACTIVA' as const,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  };

  const renderComponent = async (overrides?: {
    listRoutes?: jasmine.Spy;
    createRoute?: jasmine.Spy;
    listEnabled?: boolean;
    createEnabled?: boolean;
  }) => {
    const routesApi = {
      listRoutes: overrides?.listRoutes ?? jasmine.createSpy('listRoutes').and.returnValue(of({
        data: [route],
        meta: {
          page: 1,
          pageSize: 10,
          total: 1,
          totalPages: 1
        }
      })),
      createRoute: overrides?.createRoute ?? jasmine.createSpy('createRoute').and.returnValue(of(route))
    };

    const featureFlags = {
      isRoutesListEnabled: jasmine.createSpy('isRoutesListEnabled').and.returnValue(overrides?.listEnabled ?? true),
      isRoutesCreateEnabled: jasmine.createSpy('isRoutesCreateEnabled').and.returnValue(overrides?.createEnabled ?? true)
    };

    const renderResult = await render(RoutesPageComponent, {
      providers: [
        { provide: RoutesApiService, useValue: routesApi },
        { provide: FrontendFeatureFlagsService, useValue: featureFlags }
      ]
    });

    return { ...renderResult, routesApi, featureFlags };
  };

  it('renders table with backend routes', async () => {
    await renderComponent();

    expect(await screen.findByText('Bogotá')).toBeTruthy();
    expect(screen.getByText('Cali')).toBeTruthy();
    expect(screen.getByText('TransAndes')).toBeTruthy();
  });

  it('sends filters to API when filters are applied', async () => {
    const user = userEvent.setup();
    const { routesApi } = await renderComponent();
    const filters = within(screen.getByRole('region', { name: 'Filtros' }));

    await user.type(filters.getByLabelText('Origen'), 'Bogotá');
    await user.type(filters.getByLabelText('Destino'), 'Cali');

    fireEvent.click(screen.getByRole('button', { name: 'Aplicar filtros' }));

    await waitFor(() => {
      expect(routesApi.listRoutes).toHaveBeenCalledWith(jasmine.objectContaining({
        originCity: 'Bogotá',
        destinationCity: 'Cali',
        page: 1,
        pageSize: 10
      }));
    });
  });

  it('renders async filter results without another UI interaction', async () => {
    const user = userEvent.setup();
    const filteredRoute = {
      ...route,
      id: 2,
      originCity: 'Medellín',
      destinationCity: 'Cartagena'
    };
    const filterResponse = new Subject<{
      data: typeof route[];
      meta: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
      };
    }>();
    const listRoutes = jasmine.createSpy('listRoutes').and.returnValues(
      of({
        data: [route],
        meta: {
          page: 1,
          pageSize: 10,
          total: 1,
          totalPages: 1
        }
      }),
      filterResponse.asObservable()
    );

    await renderComponent({ listRoutes });

    await user.type(within(screen.getByRole('region', { name: 'Filtros' })).getByLabelText('Origen'), 'Medellín');
    fireEvent.click(screen.getByRole('button', { name: 'Aplicar filtros' }));

    filterResponse.next({
      data: [filteredRoute],
      meta: {
        page: 1,
        pageSize: 10,
        total: 1,
        totalPages: 1
      }
    });
    filterResponse.complete();

    expect(await screen.findByText('Cartagena')).toBeTruthy();
  });

  it('creates a route and refreshes the table', async () => {
    const user = userEvent.setup();
    const { routesApi } = await renderComponent();
    const form = within(screen.getByRole('region', { name: 'Crear ruta' }));
    const originInput = form.getByLabelText('Origen') as HTMLInputElement;
    const destinationInput = form.getByLabelText('Destino') as HTMLInputElement;
    const distanceInput = form.getByLabelText('Distancia km');
    const estimatedTimeInput = form.getByLabelText('Tiempo estimado horas');
    const costInput = form.getByLabelText('Costo USD');

    await user.type(originInput, 'Bogotá');
    await user.type(destinationInput, 'Medellín');
    await user.clear(distanceInput);
    await user.type(distanceInput, '420');
    await user.clear(estimatedTimeInput);
    await user.type(estimatedTimeInput, '8.5');
    await user.type(form.getByLabelText('Vehículo'), 'CAMION');
    await user.type(form.getByLabelText('Transportista'), 'TransAndes');
    await user.clear(costInput);
    await user.type(costInput, '320');

    fireEvent.click(screen.getByRole('button', { name: 'Crear ruta' }));

    await waitFor(() => {
      expect(routesApi.createRoute).toHaveBeenCalled();
      expect(routesApi.listRoutes).toHaveBeenCalledTimes(2);
    });
    expect(await screen.findByText('Ruta creada exitosamente.')).toBeTruthy();
    expect(originInput.value).toBe('');
    expect(destinationInput.value).toBe('');
    expect((distanceInput as HTMLInputElement).value).toBe('1');
    expect((estimatedTimeInput as HTMLInputElement).value).toBe('1');
    expect((costInput as HTMLInputElement).value).toBe('0');
  });

  it('ignores stale route search responses', async () => {
    const firstResponse = new Subject<{
      data: typeof route[];
      meta: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
      };
    }>();
    const secondRoute = {
      ...route,
      id: 2,
      originCity: 'Medellín',
      destinationCity: 'Bogotá'
    };
    const secondResponse = new Subject<{
      data: typeof route[];
      meta: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
      };
    }>();
    const listRoutes = jasmine.createSpy('listRoutes').and.returnValues(firstResponse.asObservable(), secondResponse.asObservable());

    const { fixture } = await renderComponent({ listRoutes });

    fixture.componentInstance.loadRoutes(1);

    secondResponse.next({
      data: [secondRoute],
      meta: {
        page: 1,
        pageSize: 10,
        total: 1,
        totalPages: 1
      }
    });
    secondResponse.complete();

    expect(await screen.findByText('Medellín')).toBeTruthy();

    firstResponse.next({
      data: [route],
      meta: {
        page: 1,
        pageSize: 10,
        total: 1,
        totalPages: 1
      }
    });
    firstResponse.complete();

    await waitFor(() => {
      expect(screen.queryByText('Cali')).toBeFalsy();
    });
  });

  it('shows error state when API fails', async () => {
    await renderComponent({
      listRoutes: jasmine.createSpy('listRoutes').and.returnValue(throwError(() => new Error('API down')))
    });

    expect((await screen.findByRole('alert')).textContent).toContain('No fue posible cargar las rutas');
  });

  it('shows empty state when there are no routes', async () => {
    await renderComponent({
      listRoutes: jasmine.createSpy('listRoutes').and.returnValue(of({
        data: [],
        meta: {
          page: 1,
          pageSize: 10,
          total: 0,
          totalPages: 0
        }
      }))
    });

    expect(await screen.findByText('No hay rutas para los filtros seleccionados.')).toBeTruthy();
  });
});
