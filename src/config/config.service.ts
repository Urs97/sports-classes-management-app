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

  get frontendOrigin(): string {
    return process.env.FRONTEND_ORIGIN!;
  }

  get jwtSecret(): string {
    return process.env.JWT_SECRET!;
  }

  get refreshTokenSecret(): string {
    return process.env.REFRESH_TOKEN_SECRET!;
  }

  get accessTokenExpiresIn(): string {
    return process.env.ACCESS_TOKEN_EXPIRES_IN!;
  }

  get refreshTokenExpiresIn(): string {
    return process.env.REFRESH_TOKEN_EXPIRES_IN!;
  }
}
