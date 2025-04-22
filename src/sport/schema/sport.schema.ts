import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ISportRecord } from '../interface/sport.interface';

@Entity('sports')
export class Sport implements ISportRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
}
