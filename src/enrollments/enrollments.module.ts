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
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Enrollment, User, Class]),
    AuthModule,
  ],
  controllers: [EnrollmentsController],
  providers: [
    EnrollmentsService,
    UserEnrolledListener,
    {
      provide: AbstractEnrollmentsGateway,
      useClass: EnrollmentsGateway,
    },
    EnrollmentsGateway,
  ],
})
export class EnrollmentsModule {}
