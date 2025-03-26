import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity';
import { Sport } from './sports/entities/sport.entity';
import { Class } from './classes/entities/class.entity';
import { Schedule } from './schedules/entities/schedule.entity';
import { Enrollment } from './enrollments/entities/enrollment.entity';
import { dbConfig } from './config/database/db-config';

dotenv.config();

export const AppDataSource = new DataSource({
  ...dbConfig,
  entities: [User, Sport, Class, Schedule, Enrollment],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations',
  synchronize: false,
});
