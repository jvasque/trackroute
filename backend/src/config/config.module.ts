import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { envSchema } from './env.schema';
import { EnvService } from './env.service';
import { FeatureFlagsService } from './feature-flags.service';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => envSchema.parse(config)
    })
  ],
  providers: [EnvService, FeatureFlagsService],
  exports: [EnvService, FeatureFlagsService]
})
export class AppConfigModule {}
