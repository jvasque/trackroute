import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AppExceptionFilter } from './common/errors/app-exception.filter';
import { CorrelationIdMiddleware } from './common/middleware/correlation-id.middleware';
import { EnvService } from './config/env.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true
  });

  const env = app.get(EnvService);

  app.use(helmet());
  app.enableCors({
    origin: env.corsOrigin.split(',').map((origin) => origin.trim()),
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-correlation-id'],
    credentials: true
  });

  app.use(new CorrelationIdMiddleware().use);
  app.useGlobalFilters(new AppExceptionFilter());

  await app.listen(env.port);
}

void bootstrap();
