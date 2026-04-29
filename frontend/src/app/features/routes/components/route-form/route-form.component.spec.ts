import { fireEvent, render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { RouteFormComponent } from './route-form.component';

describe('RouteFormComponent', () => {
  it('emits valid create payload', async () => {
    const user = userEvent.setup();
    const createRoute = jasmine.createSpy('createRoute');

    const renderResult = await render(RouteFormComponent, {
      componentInputs: {
        disabled: false,
        submitting: false
      }
    });

    spyOn(renderResult.fixture.componentInstance.createRoute, 'emit').and.callFake(createRoute);
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

    expect(createRoute).toHaveBeenCalledWith(jasmine.objectContaining({
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
    const createRoute = jasmine.createSpy('createRoute');

    const renderResult = await render(RouteFormComponent, {
      componentInputs: {
        disabled: false,
        submitting: false
      }
    });

    spyOn(renderResult.fixture.componentInstance.createRoute, 'emit').and.callFake(createRoute);

    fireEvent.click(screen.getByRole('button', { name: 'Crear ruta' }));

    expect(createRoute).not.toHaveBeenCalled();
    expect(screen.getByText('Origen requerido.')).toBeTruthy();
  });
});
