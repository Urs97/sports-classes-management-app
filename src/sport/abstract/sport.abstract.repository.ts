import { Injectable } from '@nestjs/common';

import { AbstractRepository } from '../../common/abstract/abstract.repository';
import { PaginationOptionsDto } from 'src/common/dto/pagination/pagination-options.dto';

import { ISportRecord } from '../interface/sport.interface';
import { Sport } from '../schema/sport.schema';

@Injectable()
export abstract class AbstractSportRepository extends AbstractRepository<Sport> {
    abstract getSportById(id: number): Promise<ISportRecord | null>;
    abstract getSportByName(name: string): Promise<ISportRecord | null>;
    abstract getSportsAndCount({page, limit}: PaginationOptionsDto): Promise<[ISportRecord[], number]>;
}
