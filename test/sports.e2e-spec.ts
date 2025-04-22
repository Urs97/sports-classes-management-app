import { setupE2ETest } from './utils/setup-e2e';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createAdminAndLogin } from './utils/test-helpers';

describe('Sports E2E', () => {
  let app: INestApplication;
  let http: ReturnType<typeof request.agent>;
  let accessToken: string;

  beforeEach(async () => {
    const setup = await setupE2ETest();
    app = setup.app;
    http = setup.http;

    const result = await createAdminAndLogin(http, setup.dataSource, {
      email: 'admin@sports.com',
      password: 'Admin123!',
    });

    accessToken = result.accessToken;
  });

  afterEach(async () => {
    await app.close();
  });

  it('should create a new sport', async () => {
    const res = await http
      .post('/sports')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Basketball' })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Basketball');
  });

  it('should list all sports with pagination', async () => {
    await http
      .post('/sports')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Football' })
      .expect(201);
  
    const res = await http.get('/sports?page=1&limit=10').expect(200);
  
    expect(res.body).toHaveProperty('items');
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.some((sport) => sport.name === 'Football')).toBe(true);
  
    expect(res.body).toHaveProperty('meta');
    expect(res.body.meta).toMatchObject({
      page: 1,
      limit: 10,
      itemCount: expect.any(Number),
      pageCount: expect.any(Number),
      hasPreviousPage: expect.any(Boolean),
      hasNextPage: expect.any(Boolean),
    });
  });  

  it('should update a sport', async () => {
    const createRes = await http
      .post('/sports')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Volleyball' })
      .expect(201);

    const sportId = createRes.body.id;

    const res = await http
      .put(`/sports/${sportId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Beach Volleyball' })
      .expect(200);

    expect(res.body.name).toBe('Beach Volleyball');
  });

  it('should delete a sport', async () => {
    const createRes = await http
      .post('/sports')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Handball' })
      .expect(201);
  
    const sportId = createRes.body.id;
  
    await http
      .delete(`/sports/${sportId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204);
  });  
});
