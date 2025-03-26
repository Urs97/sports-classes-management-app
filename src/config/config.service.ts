import { Injectable } from '@nestjs/common';
import { dbConfig } from './database/db-config';

@Injectable()
export class AppConfigService {
  get dbType(): 'postgres' {
    return dbConfig.type;
  }

  get dbHost(): string {
    return dbConfig.host;
  }

  get dbPort(): number {
    return dbConfig.port;
  }

  get dbUser(): string {
    return dbConfig.username;
  }

  get dbPassword(): string {
    return dbConfig.password;
  }

  get dbName(): string {
    return dbConfig.database;
  }
}
