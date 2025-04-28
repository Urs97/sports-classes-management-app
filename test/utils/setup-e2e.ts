import { ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { DataSource } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';

let app;
let dataSource;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleRef.createNestApplication();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(3001);
  dataSource = app.get(getDataSourceToken()) as DataSource;

  globalThis['e2eApp'] = app;
  globalThis['e2eDataSource'] = dataSource;
});

beforeEach(async () => {
  const dataSource = globalThis['e2eDataSource'];
  await truncateAllTables(dataSource);
});

afterAll(async () => {
  await app.close();
});

const truncateAllTables = async (dataSource: DataSource) => {
  const entities = dataSource.entityMetadatas;
  for (const entity of entities) {
    const repo = dataSource.getRepository(entity.name);
    await repo.query(`TRUNCATE TABLE "${entity.tableName}" RESTART IDENTITY CASCADE`);
  }
};
