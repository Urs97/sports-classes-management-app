import { Injectable, ConflictException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { AbstractTransaction } from '../../common/abstract/abstract.transaction';
import { ISport, ISportRecord } from '../interface/sport.interface';
import { Sport } from '../schema/sport.schema';

@Injectable()
export class CreateSportTransaction extends AbstractTransaction<
  Partial<ISport>,
  ISportRecord
> {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  async execute(data: Partial<ISport>, manager: EntityManager): Promise<ISportRecord> {
    const existing = await manager.getRepository(Sport).findOne({ where: { name: data.name } });

    if (existing) throw new ConflictException('Sport already exists');

    return await manager.getRepository(Sport).save(data);
  }
}
