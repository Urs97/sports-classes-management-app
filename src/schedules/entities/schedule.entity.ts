import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Class } from '../../classes/entities/class.entity';

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Class, (cls) => cls.schedules, { onDelete: 'CASCADE' })
  class: Class;

  @Column()
  date: Date;

  @Column()
  duration: number;
}
