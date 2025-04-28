import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';

export const getApp = (): INestApplication => globalThis['e2eApp'];
export const getDataSource = (): DataSource => globalThis['e2eDataSource'];
