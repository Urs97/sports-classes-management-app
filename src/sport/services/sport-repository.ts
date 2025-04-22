import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginationOptionsDto } from 'src/common/dto/pagination/pagination-options.dto';

import { AbstractSportRepository } from '../abstract/sport.abstract.repository';
import { ISportRecord } from '../interface/sport.interface';
import { Sport } from '../schema/sport.schema';

@Injectable()
export class SportRepository extends AbstractSportRepository {
  constructor(
    @InjectRepository(Sport)
    repo: Repository<Sport>,
  ) {
    super(repo);
  }

  async getSportById(id: number): Promise<ISportRecord | null> {
    return this.entity.findOne({ where: { id } });
  }

  async getSportByName(name: string): Promise<ISportRecord | null> {
    return this.entity.findOne({ where: { name } });
  }

  async getSportsAndCount({
    page,
    limit,
  }: PaginationOptionsDto): Promise<[ISportRecord[], number]> {
    const skip = (page - 1) * limit;
    return await this.entity.findAndCount({ skip, take: limit });
  }
}
