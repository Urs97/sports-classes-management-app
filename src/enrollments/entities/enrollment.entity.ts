import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Column, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Class } from '../../classes/entities/class.entity';

@Entity('enrollments')
export class Enrollment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'userId' })
  userId: number;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ name: 'classId' })
  classId: number;

  @ManyToOne(() => Class, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'classId' })
  class: Class;

  @CreateDateColumn()
  enrolledAt: Date;
}
