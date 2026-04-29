import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppExceptionFilter } from '../src/common/errors/app-exception.filter';
import { CreateRouteUseCase } from '../src/modules/routes/application/create-route.use-case';
import { ListRoutesUseCase } from '../src/modules/routes/application/list-routes.use-case';
import { RoutesController } from '../src/modules/routes/routes.controller';

describe('RoutesController e2e', () => {
  let app: INestApplication;

  const listRoutesUseCase = {
    execute: jest.fn()
  };

  const createRouteUseCase = {
    execute: jest.fn()
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [RoutesController],
      providers: [
        { provide: ListRoutesUseCase, useValue: listRoutesUseCase },
        { provide: CreateRouteUseCase, useValue: createRouteUseCase }
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
      updatedAt: '2024-01-01T00:00:00.000Z'
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
});
