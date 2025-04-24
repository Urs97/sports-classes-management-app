import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { User } from '../users/entities/user.entity';
import { Class } from '../classes/entities/class.entity';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserEnrolledEvent } from './events/user-enrolled.event';
import { EnrollmentEvents } from './constants/enrollment-events.enum';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentsRepo: Repository<Enrollment>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Class)
    private readonly classRepo: Repository<Class>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(userId: number, dto: CreateEnrollmentDto): Promise<Enrollment> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    const classEntity = await this.classRepo.findOne({
      where: { id: dto.classId },
      relations: ['createdBy'],
    });

    if (!user) throw new NotFoundException('User not found');
    if (!classEntity) throw new NotFoundException('Class not found');

    const existing = await this.enrollmentsRepo.findOne({
      where: { user: { id: userId }, class: { id: dto.classId } },
    });

    if (existing) throw new ConflictException('Already enrolled');

    const enrollment = this.enrollmentsRepo.create({ user, class: classEntity });
    const savedEnrollment = await this.enrollmentsRepo.save(enrollment);

    this.eventEmitter.emit(
      EnrollmentEvents.USER_ENROLLED,
      new UserEnrolledEvent(user.email, classEntity.description, classEntity.createdBy.id),
    );

    return savedEnrollment;
  }

  async findAll(): Promise<Enrollment[]> {
    return this.enrollmentsRepo.find({ relations: ['user', 'class'] });
  }

  async findByClass(classId: number): Promise<Enrollment[]> {
    return this.enrollmentsRepo.find({
      where: { class: { id: classId } },
      relations: ['user', 'class'],
    });
  }

  async findByUser(userId: number): Promise<Enrollment[]> {
    return this.enrollmentsRepo.find({
      where: { user: { id: userId } },
      relations: ['user', 'class'],
    });
  }
}
