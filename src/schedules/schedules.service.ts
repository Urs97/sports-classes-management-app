import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { Repository } from 'typeorm';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Class } from '../classes/entities/class.entity';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepo: Repository<Schedule>,

    @InjectRepository(Class)
    private readonly classRepo: Repository<Class>,
  ) {}

  async create(dto: CreateScheduleDto): Promise<Schedule> {
    const classEntity = await this.classRepo.findOne({ where: { id: dto.classId } });
    if (!classEntity) throw new NotFoundException('Class not found');

    const schedule = this.scheduleRepo.create({
      class: classEntity,
      date: dto.date,
      duration: dto.duration,
    });

    return this.scheduleRepo.save(schedule);
  }

  async findAll(): Promise<Schedule[]> {
    return this.scheduleRepo.find({ relations: ['class'] });
  }

  async findOne(id: number): Promise<Schedule> {
    const schedule = await this.scheduleRepo.findOne({
      where: { id },
      relations: ['class'],
    });
    if (!schedule) throw new NotFoundException('Schedule not found');
    return schedule;
  }

  async update(id: number, dto: UpdateScheduleDto): Promise<Schedule> {
    const schedule = await this.findOne(id);

    if (dto.classId) {
      const classEntity = await this.classRepo.findOne({ where: { id: dto.classId } });
      if (!classEntity) throw new NotFoundException('Class not found');
      schedule.class = classEntity;
    }

    Object.assign(schedule, dto);
    return this.scheduleRepo.save(schedule);
  }

  async remove(id: number): Promise<void> {
    const schedule = await this.findOne(id);
    await this.scheduleRepo.remove(schedule);
  }
}
