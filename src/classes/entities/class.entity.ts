import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Sport } from '../../sport/schema/sport.schema';
import { Schedule } from '../../schedules/entities/schedule.entity';
import { User } from '../../users/entities/user.entity';

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

  @Column({ name: 'createdById' })
  createdById: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'createdById' })
  createdBy: User;
}
