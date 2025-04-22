import { IPaginationParams } from '../../common/pagination/pagination-params.interface';
import { PaginationModel } from '../../common/pagination/pagination-model';

import { ISport, ISportRecord } from '../interface/sport.interface';

export abstract class AbstractSportService {
  abstract createSport(data: Partial<ISport>): Promise<ISportRecord>;
  abstract listSports(pagination: IPaginationParams): Promise<PaginationModel<ISportRecord>>;
  abstract updateSport(id: number, data: Partial<ISport>): Promise<ISportRecord>;
  abstract removeSport(id: number): Promise<void>;
}
