import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/database/typeorm-config.service';
import { AppConfigModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SportModule } from './sport/sport.module';
import { ClassesModule } from './classes/classes.module';
import { SchedulesModule } from './schedules/schedules.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      useClass: TypeOrmConfigService,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    EventEmitterModule.forRoot(),
    AuthModule,
    UsersModule,
    SportModule,
    ClassesModule,
    SchedulesModule,
    EnrollmentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
