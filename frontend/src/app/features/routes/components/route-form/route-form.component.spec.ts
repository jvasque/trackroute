import { fireEvent, render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { RouteFormComponent } from './route-form.component';

describe('RouteFormComponent', () => {
  const initialRoute = {
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
    updatedAt: '2024-01-01T00:00:00.000Z',
    deletedAt: null
  };

  it('emits valid create payload', async () => {
    const user = userEvent.setup();
    const saveRoute = jasmine.createSpy('saveRoute');

    const renderResult = await render(RouteFormComponent, {
      componentInputs: {
        disabled: false,
        submitting: false,
        mode: 'create'
      }
    });

    spyOn(renderResult.fixture.componentInstance.saveRoute, 'emit').and.callFake(saveRoute);
    const distanceInput = screen.getByLabelText('Distancia km');
    const estimatedTimeInput = screen.getByLabelText('Tiempo estimado horas');
    const costInput = screen.getByLabelText('Costo USD');

    await user.type(screen.getByLabelText('Origen'), 'Bogotá');
    await user.type(screen.getByLabelText('Destino'), 'Cali');
    await user.clear(distanceInput);
    await user.type(distanceInput, '462');
    await user.clear(estimatedTimeInput);
    await user.type(estimatedTimeInput, '9.5');
    await user.type(screen.getByLabelText('Vehículo'), 'CAMION');
    await user.type(screen.getByLabelText('Transportista'), 'TransAndes');
    await user.clear(costInput);
    await user.type(costInput, '390');

    fireEvent.click(screen.getByRole('button', { name: 'Crear ruta' }));

    expect(saveRoute).toHaveBeenCalledWith(jasmine.objectContaining({
      originCity: 'Bogotá',
      destinationCity: 'Cali',
      distanceKm: 462,
      estimatedTimeHours: 9.5,
      vehicleType: 'CAMION',
      carrier: 'TransAndes',
      costUsd: 390,
      status: 'ACTIVA'
    }));
  });

  it('does not emit when required fields are missing', async () => {
    const saveRoute = jasmine.createSpy('saveRoute');

    const renderResult = await render(RouteFormComponent, {
      componentInputs: {
        disabled: false,
        submitting: false,
        mode: 'create'
      }
    });

    spyOn(renderResult.fixture.componentInstance.saveRoute, 'emit').and.callFake(saveRoute);

    fireEvent.click(screen.getByRole('button', { name: 'Crear ruta' }));

    expect(saveRoute).not.toHaveBeenCalled();
    expect(screen.getByText('Origen requerido.')).toBeTruthy();
  });

  it('loads edit values and emits cancel when editing is cancelled', async () => {
    const cancelEdit = jasmine.createSpy('cancelEdit');

    const renderResult = await render(RouteFormComponent, {
      componentInputs: {
        disabled: false,
        submitting: false,
        mode: 'edit',
        initialValue: initialRoute
      }
    });

    spyOn(renderResult.fixture.componentInstance.cancelEdit, 'emit').and.callFake(cancelEdit);

    expect(screen.getByRole('heading', { name: 'Editar ruta' })).toBeTruthy();
    expect((screen.getByLabelText('Origen') as HTMLInputElement).value).toBe('Bogotá');

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(cancelEdit).toHaveBeenCalled();
  });
});
