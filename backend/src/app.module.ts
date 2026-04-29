import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { PrismaModule } from './database/prisma.module';
import { RoutesModule } from './modules/routes/routes.module';

@Module({
  imports: [AppConfigModule, PrismaModule, RoutesModule]
})
export class AppModule {}
