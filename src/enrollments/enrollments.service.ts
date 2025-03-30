import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { User } from '../users/entities/user.entity';
import { Class } from '../classes/entities/class.entity';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentsRepo: Repository<Enrollment>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Class)
    private readonly classRepo: Repository<Class>,
  ) {}

  async create(userId: number, dto: CreateEnrollmentDto): Promise<Enrollment> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    const classEntity = await this.classRepo.findOne({ where: { id: dto.classId } });

    if (!user) throw new NotFoundException('User not found');
    if (!classEntity) throw new NotFoundException('Class not found');

    const existing = await this.enrollmentsRepo.findOne({
      where: { user: { id: userId }, class: { id: dto.classId } },
    });

    if (existing) throw new ConflictException('Already enrolled');

    const enrollment = this.enrollmentsRepo.create({ user, class: classEntity });
    return this.enrollmentsRepo.save(enrollment);
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
