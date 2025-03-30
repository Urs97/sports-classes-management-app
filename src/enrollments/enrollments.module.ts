import { Module } from '@nestjs/common';
import { EnrollmentsController } from './enrollments.controller';
import { EnrollmentsService } from './enrollments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { User } from 'src/users/entities/user.entity';
import { Class } from 'src/classes/entities/class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Enrollment, User, Class])],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService]
})
export class EnrollmentsModule {}
