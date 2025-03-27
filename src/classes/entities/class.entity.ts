import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Sport } from '../../sports/entities/sport.entity';
import { Schedule } from '../../schedules/entities/schedule.entity';

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Sport, { eager: true })
  sport: Sport;

  @Column()
  description: string;

  @Column()
  duration: number; // in minutes

  @OneToMany(() => Schedule, (schedule) => schedule.class)
  schedules: Schedule[];
}
