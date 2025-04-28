import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppConfigService } from '../config.service';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly appConfigService: AppConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.appConfigService.dbType,
      host: this.appConfigService.dbHost,
      port: this.appConfigService.dbPort,
      username: this.appConfigService.dbUser,
      password: this.appConfigService.dbPassword,
      database: this.appConfigService.dbName,
      autoLoadEntities: true,
      synchronize: false,
    };
  }
}
