import { Injectable, NotFoundException, Inject, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Class } from './entities/class.entity';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { AbstractSportRepository } from '../sport/abstract/sport.abstract.repository';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepo: Repository<Class>,

    @Inject(AbstractSportRepository)
    private readonly sportRepo: AbstractSportRepository,
  ) {}

  async create(dto: CreateClassDto, adminId: { id: number }): Promise<Class> {
    const sport = await this.sportRepo.findOne({ where: { id: dto.sportId } });
    if (!sport) throw new NotFoundException('Sport not found');
  
    const newClass = this.classRepo.create({
      sport,
      description: dto.description,
      duration: dto.duration,
      createdBy: adminId
    });

    return this.classRepo.save(newClass);
  }  

  async findAll(sportsFilter?: string[]): Promise<Class[]> {
    if (sportsFilter && sportsFilter.length) {
      return this.classRepo.find({
        where: { sport: { name: In(sportsFilter) } },
        relations: ['sport'],
      });
    }
    return this.classRepo.find({ relations: ['sport'] });
  }

  async findOne(id: number): Promise<Class> {
    const found = await this.classRepo.findOne({
      where: { id },
      relations: ['sport', 'schedules'],
    });
    if (!found) throw new NotFoundException('Class not found');
    return found;
  }

  async update(id: number, dto: UpdateClassDto): Promise<Class> {
    const cls = await this.findOne(id);

    if (dto.sportId) {
      const sport = await this.sportRepo.findOne({ where: { id: dto.sportId } });
      if (!sport) throw new NotFoundException('Sport not found');
      cls.sport = sport;
    }

    Object.assign(cls, dto);
    return this.classRepo.save(cls);
  }

  async remove(id: number): Promise<void> {
    const cls = await this.findOne(id);
    await this.classRepo.remove(cls);
  }
}
