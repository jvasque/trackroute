import { ForbiddenException, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppExceptionFilter } from '../src/common/errors/app-exception.filter';
import { CreateRouteUseCase } from '../src/modules/routes/application/create-route.use-case';
import { GetActiveRoutesTrackingUseCase } from '../src/modules/routes/application/get-active-routes-tracking.use-case';
import { GetRouteByIdUseCase } from '../src/modules/routes/application/get-route-by-id.use-case';
import { ListRoutesUseCase } from '../src/modules/routes/application/list-routes.use-case';
import { SoftDeleteRouteUseCase } from '../src/modules/routes/application/soft-delete-route.use-case';
import { UpdateRouteUseCase } from '../src/modules/routes/application/update-route.use-case';
import { RoutesController } from '../src/modules/routes/routes.controller';

describe('RoutesController e2e', () => {
  let app: INestApplication;

  const listRoutesUseCase = {
    execute: jest.fn()
  };

  const createRouteUseCase = {
    execute: jest.fn()
  };

  const getRouteByIdUseCase = {
    execute: jest.fn()
  };

  const getActiveRoutesTrackingUseCase = {
    execute: jest.fn()
  };

  const updateRouteUseCase = {
    execute: jest.fn()
  };

  const softDeleteRouteUseCase = {
    execute: jest.fn()
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [RoutesController],
      providers: [
        { provide: ListRoutesUseCase, useValue: listRoutesUseCase },
        { provide: CreateRouteUseCase, useValue: createRouteUseCase },
        { provide: GetActiveRoutesTrackingUseCase, useValue: getActiveRoutesTrackingUseCase },
        { provide: GetRouteByIdUseCase, useValue: getRouteByIdUseCase },
        { provide: UpdateRouteUseCase, useValue: updateRouteUseCase },
        { provide: SoftDeleteRouteUseCase, useValue: softDeleteRouteUseCase }
      ]
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalFilters(new AppExceptionFilter());

    await app.init();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /routes validates query and returns paginated data', async () => {
    listRoutesUseCase.execute.mockResolvedValue({
      data: [],
      meta: {
        page: 1,
        pageSize: 20,
        total: 0,
        totalPages: 0
      }
    });

    const response = await request(app.getHttpServer()).get('/routes?page=1&pageSize=20').expect(200);

    expect(response.body.meta.page).toBe(1);
    expect(listRoutesUseCase.execute).toHaveBeenCalledWith({
      page: 1,
      pageSize: 20
    });
  });

  it('GET /routes rejects invalid pageSize', async () => {
    await request(app.getHttpServer()).get('/routes?page=1&pageSize=101').expect(400);
    expect(listRoutesUseCase.execute).not.toHaveBeenCalled();
  });

  it('GET /routes/:id returns one route by id', async () => {
    getRouteByIdUseCase.execute.mockResolvedValue({
      id: 1,
      originCity: 'Bogotá',
      destinationCity: 'Medellín',
      distanceKm: 415,
      estimatedTimeHours: 8.5,
      vehicleType: 'CAMION',
      carrier: 'TCC',
      costUsd: 320,
      status: 'ACTIVA',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      deletedAt: null
    });

    const response = await request(app.getHttpServer()).get('/routes/1').expect(200);

    expect(response.body.id).toBe(1);
    expect(getRouteByIdUseCase.execute).toHaveBeenCalledWith(1);
  });

  it('GET /routes/:id rejects invalid id', async () => {
    await request(app.getHttpServer()).get('/routes/abc').expect(400);
    expect(getRouteByIdUseCase.execute).not.toHaveBeenCalled();
  });

  it('GET /routes/active/tracking returns active routes tracking data', async () => {
    getActiveRoutesTrackingUseCase.execute.mockResolvedValue({
      data: [
        {
          route: {
            id: 1,
            originCity: 'Bogotá',
            destinationCity: 'Cali',
            vehicleType: 'CAMION',
            carrier: 'TransAndes',
            status: 'ACTIVA'
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
        }
      ]
    });

    const response = await request(app.getHttpServer()).get('/routes/active/tracking').expect(200);

    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].route.status).toBe('ACTIVA');
    expect(getActiveRoutesTrackingUseCase.execute).toHaveBeenCalled();
  });

  it('GET /routes/active/tracking returns 403 when tracking feature is disabled', async () => {
    getActiveRoutesTrackingUseCase.execute.mockRejectedValue(
      new ForbiddenException('Tracking feature is disabled')
    );

    await request(app.getHttpServer()).get('/routes/active/tracking').expect(403);
  });

  it('POST /routes creates route', async () => {
    createRouteUseCase.execute.mockResolvedValue({
      id: 1,
      originCity: 'Bogotá',
      destinationCity: 'Cali',
      distanceKm: 462,
      estimatedTimeHours: 9.5,
      vehicleType: 'CAMION',
      carrier: 'TransAndes',
      costUsd: 390,
      status: 'ACTIVA',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      deletedAt: null
    });

    const payload = {
      originCity: 'Bogotá',
      destinationCity: 'Cali',
      distanceKm: 462,
      estimatedTimeHours: 9.5,
      vehicleType: 'CAMION',
      carrier: 'TransAndes',
      costUsd: 390,
      status: 'ACTIVA'
    };

    const response = await request(app.getHttpServer()).post('/routes').send(payload).expect(201);

    expect(response.body.id).toBe(1);
    expect(createRouteUseCase.execute).toHaveBeenCalledWith(payload);
  });

  it('POST /routes rejects invalid body', async () => {
    await request(app.getHttpServer())
      .post('/routes')
      .send({
        originCity: '',
        destinationCity: 'Cali',
        distanceKm: -1,
        estimatedTimeHours: 9.5,
        vehicleType: 'CAMION',
        carrier: 'TransAndes',
        costUsd: 390
      })
      .expect(400);

    expect(createRouteUseCase.execute).not.toHaveBeenCalled();
  });

  it('PATCH /routes/:id updates a route partially', async () => {
    updateRouteUseCase.execute.mockResolvedValue({
      id: 1,
      originCity: 'Bogotá',
      destinationCity: 'Medellín',
      distanceKm: 415,
      estimatedTimeHours: 8.5,
      vehicleType: 'CAMION',
      carrier: 'Nuevo Transportista',
      costUsd: 320,
      status: 'ACTIVA',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-02T00:00:00.000Z',
      deletedAt: null
    });

    const response = await request(app.getHttpServer())
      .patch('/routes/1')
      .send({ carrier: 'Nuevo Transportista' })
      .expect(200);

    expect(response.body.carrier).toBe('Nuevo Transportista');
    expect(updateRouteUseCase.execute).toHaveBeenCalledWith(1, { carrier: 'Nuevo Transportista' });
  });

  it('PATCH /routes/:id rejects empty update body', async () => {
    await request(app.getHttpServer()).patch('/routes/1').send({}).expect(400);
    expect(updateRouteUseCase.execute).not.toHaveBeenCalled();
  });

  it('PATCH /routes/:id rejects invalid update body', async () => {
    await request(app.getHttpServer()).patch('/routes/1').send({ distanceKm: -1 }).expect(400);
    expect(updateRouteUseCase.execute).not.toHaveBeenCalled();
  });

  it('DELETE /routes/:id soft deletes a route', async () => {
    softDeleteRouteUseCase.execute.mockResolvedValue({
      id: 1,
      originCity: 'Bogotá',
      destinationCity: 'Medellín',
      distanceKm: 415,
      estimatedTimeHours: 8.5,
      vehicleType: 'CAMION',
      carrier: 'TCC',
      costUsd: 320,
      status: 'INACTIVA',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-02T00:00:00.000Z',
      deletedAt: '2024-01-02T00:00:00.000Z'
    });

    const response = await request(app.getHttpServer()).delete('/routes/1').expect(200);

    expect(response.body.status).toBe('INACTIVA');
    expect(response.body.deletedAt).toBe('2024-01-02T00:00:00.000Z');
    expect(softDeleteRouteUseCase.execute).toHaveBeenCalledWith(1);
  });

  it('DELETE /routes/:id rejects invalid id', async () => {
    await request(app.getHttpServer()).delete('/routes/0').expect(400);
    expect(softDeleteRouteUseCase.execute).not.toHaveBeenCalled();
  });
});
