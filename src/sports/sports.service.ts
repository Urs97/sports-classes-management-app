import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sport } from './entities/sport.entity';
import { CreateSportDto } from './dto/create-sport.dto';
import { UpdateSportDto } from './dto/update-sport.dto';

@Injectable()
export class SportsService {
  constructor(
    @InjectRepository(Sport)
    private readonly sportsRepository: Repository<Sport>,
  ) {}

  async create(dto: CreateSportDto): Promise<Sport> {
    const existing = await this.sportsRepository.findOne({ where: { name: dto.name } });
    if (existing) {
      throw new ConflictException('Sport already exists');
    }
    const sport = this.sportsRepository.create(dto);
    return this.sportsRepository.save(sport);
  }

  async findAll(): Promise<Sport[]> {
    return this.sportsRepository.find();
  }

  async findOne(id: number): Promise<Sport> {
    const sport = await this.sportsRepository.findOne({ where: { id } });
    if (!sport) throw new NotFoundException(`Sport with ID ${id} not found`);
    return sport;
  }

  async update(id: number, dto: UpdateSportDto): Promise<Sport> {
    const sport = await this.findOne(id);
    Object.assign(sport, dto);
    return this.sportsRepository.save(sport);
  }

  async remove(id: number): Promise<void> {
    const sport = await this.findOne(id);
    await this.sportsRepository.remove(sport);
  }
}
