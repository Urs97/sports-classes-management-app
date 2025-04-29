import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity';
import { Sport } from './sport/schema/sport.schema';
import { Class } from './classes/entities/class.entity';
import { Schedule } from './schedules/entities/schedule.entity';
import { Enrollment } from './enrollments/entities/enrollment.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DBNAME,
  entities: [User, Sport, Class, Schedule, Enrollment],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations',
  synchronize: false,
}); 