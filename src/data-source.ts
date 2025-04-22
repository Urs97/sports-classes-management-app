import { DataSource } from 'typeorm';
import { dbConfig } from './config/database/db-config';
import { User } from './users/entities/user.entity';
import { Sport } from './sport/schema/sport.schema';
import { Class } from './classes/entities/class.entity';
import { Schedule } from './schedules/entities/schedule.entity';
import { Enrollment } from './enrollments/entities/enrollment.entity';

export const AppDataSource = new DataSource({
  ...dbConfig,
  entities: [User, Sport, Class, Schedule, Enrollment],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations',
  synchronize: false,
});
