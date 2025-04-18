import { ISport, ISportRecord } from '../interface/sport.interface';

export abstract class AbstractSportService {
  abstract createSport(data: Partial<ISport>): Promise<ISportRecord>;
  abstract listSports(): Promise<ISportRecord[]>;
  abstract updateSport(id: number, data: Partial<ISport>): Promise<ISportRecord>;
  abstract removeSport(id: number): Promise<void>;
}
