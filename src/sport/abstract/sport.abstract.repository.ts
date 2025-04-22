import { Injectable } from '@nestjs/common';
import { AbstractRepository } from '../../common/abstract/abstract.repository';
import { ISportRecord } from '../interface/sport.interface';
import { Sport } from '../schema/sport.schema';

@Injectable()
export abstract class AbstractSportRepository extends AbstractRepository<Sport> {
    abstract getSportById(id: number): Promise<ISportRecord | null>;
    abstract getAllSports(): Promise<ISportRecord[]>;
}
