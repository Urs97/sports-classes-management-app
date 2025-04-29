import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { TypeOrmConfig } from '../config/env.validation';

@Injectable()
export class TypeOrmOptions implements TypeOrmOptionsFactory {
  private RETRY_ATTEMPS: number;
  private RETRY_DELAY_MS: number;
  private POOL_SIZE: number;
  private CONNECTION_TIMEOUT_MS: number;
  private QUERY_TIMEOUT_MS: number;
  private STATEMENT_TIMEOUT_MS: number;

  constructor(private readonly config: TypeOrmConfig) {
    this.RETRY_ATTEMPS = 10;
    this.RETRY_DELAY_MS = 2000;
    this.POOL_SIZE = 50;
    this.CONNECTION_TIMEOUT_MS = 2000;
    this.QUERY_TIMEOUT_MS = 10000;
    this.STATEMENT_TIMEOUT_MS = 10000;
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.config.HOST,
      port: this.config.PORT,
      username: this.config.USERNAME,
      password: this.config.PASSWORD,
      database: this.config.DBNAME,
      autoLoadEntities: true,
      retryAttempts: this.RETRY_ATTEMPS,
      retryDelay: this.RETRY_DELAY_MS,
      synchronize: true, // TODO Remove
      migrationsRun: false, // TODO Enable
      extra: {
        poolSize: this.POOL_SIZE,
        connectionTimeoutMillis: this.CONNECTION_TIMEOUT_MS,
        query_timeout: this.QUERY_TIMEOUT_MS,
        statement_timeout: this.STATEMENT_TIMEOUT_MS,
      },
      migrationsTransactionMode: 'each',
      migrations: ['dist/db/migrations/*{.ts,.js}'],
      migrationsTableName: 'migration_table',
    };
  }
}
