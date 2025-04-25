import { Module } from '@nestjs/common';
import { EnrollmentsController } from './enrollments.controller';
import { EnrollmentsService } from './enrollments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { User } from '../users/entities/user.entity';
import { Class } from '../classes/entities/class.entity';
import { EnrollmentsGateway } from './gateway/enrollments.gateway';
import { AbstractEnrollmentsGateway } from './abstract/enrollments.abstract.gateway';
import { UserEnrolledListener } from './listeners/user-enrolled.listener';
import { AuthModule } from '../auth/auth.module';
import { WsJwtAuthMiddleware } from '../auth/guards/jwt-ws.middleware';
import { AbstractWsJwtAuthMiddleware } from '../auth/abstract/jwt-ws.abstract.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([Enrollment, User, Class]),
    AuthModule,
  ],
  controllers: [EnrollmentsController],
  providers: [
    EnrollmentsService,
    UserEnrolledListener,
    EnrollmentsGateway,
    {
      provide: AbstractEnrollmentsGateway,
      useExisting: EnrollmentsGateway,
    },
    WsJwtAuthMiddleware,
    {
      provide: AbstractWsJwtAuthMiddleware,
      useClass: WsJwtAuthMiddleware,
    },
  ],
})
export class EnrollmentsModule {}
