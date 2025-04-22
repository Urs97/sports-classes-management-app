import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

  async getAllSports(): Promise<ISportRecord[]> {
    return this.entity.find();
  }
}
