import { Injectable, NotFoundException } from '@nestjs/common';

import { AbstractSportService } from '../abstract/sport.abstract.service';
import { AbstractSportRepository } from '../abstract/sport.abstract.repository';
import { ISport, ISportRecord } from '../interface/sport.interface';
import { CreateSportTransaction } from './create-sport-transaction';

@Injectable()
export class SportService extends AbstractSportService {
  constructor(
    private readonly sportRepository: AbstractSportRepository,
    private readonly createSportTransaction: CreateSportTransaction,
  ) {
    super();
  }

  async createSport(data: Partial<ISport>): Promise<ISportRecord> {
    return this.createSportTransaction.run(data);
  }

  async listSports(): Promise<ISportRecord[]> {
    return this.sportRepository.getAllSports();
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
