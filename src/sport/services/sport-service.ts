import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { PaginationModel } from '../../common/pagination/pagination-model';
import { IPaginationParams } from 'src/common/pagination/pagination-params.interface';

import { AbstractSportService } from '../abstract/sport.abstract.service';
import { AbstractSportRepository } from '../abstract/sport.abstract.repository';
import { ISport, ISportRecord } from '../interface/sport.interface';

@Injectable()
export class SportService extends AbstractSportService {
  constructor(
    private readonly sportRepository: AbstractSportRepository,
  ) {
    super();
  }

  async createSport(data: ISport): Promise<ISportRecord> {
    const existing = await this.sportRepository.getSportByName(data.name);

    if (existing) {
      throw new ConflictException(`Sport with name '${data.name}' already exists`);
    }

    return this.sportRepository.create(data);
  }
  
  async listSports(pagination: IPaginationParams): Promise<PaginationModel<ISportRecord>> {
    const [items, count] = await this.sportRepository.getSportsAndCount(pagination);
    return new PaginationModel(items, pagination, count);
  }

  async updateSport(id: number, data: Partial<ISport>): Promise<ISportRecord> {
    const sport = await this.sportRepository.getSportById(id);
    if (!sport) {
      throw new NotFoundException(`Sport with ID ${id} not found`);
    }
  
    await this.sportRepository.save({ ...sport, ...data });
  
    const updated = await this.sportRepository.getSportById(id);
    if (!updated) {
      throw new NotFoundException(`Failed to retrieve updated sport with ID ${id}`);
    }
  
    return updated;
  }

  async removeSport(id: number): Promise<void> {
    const sport = await this.sportRepository.getSportById(id);
    if (!sport) {
      throw new NotFoundException(`Sport with ID ${id} not found`);
    }

    await this.sportRepository.delete({ id });
  }
}
