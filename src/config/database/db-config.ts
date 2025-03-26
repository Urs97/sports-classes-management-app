import * as dotenv from 'dotenv';
dotenv.config();

interface DatabaseConfig {
  type: 'postgres';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is not defined`);
  }
  return value;
}

export const dbConfig: DatabaseConfig = {
  type: 'postgres',
  host: getEnvVar('DB_HOST'),
  port: parseInt(getEnvVar('DB_PORT')),
  username: getEnvVar('DB_USER'),
  password: getEnvVar('DB_PASSWORD'),
  database: getEnvVar('DB_NAME'),
};
