import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypedConfigModule, dotenvLoader } from 'nest-typed-config';
import { WinstonModule } from 'nest-winston';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SportModule } from './sport/sport.module';
import { ClassesModule } from './classes/classes.module';
import { SchedulesModule } from './schedules/schedules.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { RootConfig, TypeOrmConfig } from './common/config/env.validation';
import { WinstonOptions } from './common/providers/winston.provider';
import { TypeOrmOptions } from './common/providers/typeorm.provider';

@Module({
  imports: [
    // Environment variables
    TypedConfigModule.forRoot({
      schema: RootConfig,
      load: dotenvLoader({ separator: '_' }),
    }),

    // Logging
    WinstonModule.forRootAsync({
      useClass: WinstonOptions,
    }),

    // TypeORM
    TypeOrmModule.forRootAsync({
      imports: [TypedConfigModule],
      inject: [TypeOrmConfig],
      useClass: TypeOrmOptions,
    }),

    // Throttling
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60000, limit: 10 }],
    }),

    // Event Emitter
    EventEmitterModule.forRoot(),

    // Modules
    AuthModule,
    UsersModule,
    SportModule,
    ClassesModule,
    SchedulesModule,
    EnrollmentsModule,
  ],
  controllers: [],
  providers: [],
  exports: [WinstonModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
  }
}