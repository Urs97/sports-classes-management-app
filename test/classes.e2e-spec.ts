import { setupE2ETest } from './utils/setup-e2e';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createAdminAndLogin } from './utils/test-helpers';

describe('Classes E2E', () => {
  let app: INestApplication;
  let http: ReturnType<typeof request.agent>;
  let accessToken: string;
  let sportId: number;
  let classId: number;

  beforeEach(async () => {
    const setup = await setupE2ETest();
    app = setup.app;
    http = setup.http;

    const result = await createAdminAndLogin(http, setup.dataSource, {
      email: 'admin@classes.com',
      password: 'Admin123!',
    });

    accessToken = result.accessToken;

    const sportRes = await http
      .post('/sports')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Tennis' })
      .expect(201);

    sportId = sportRes.body.id;

    const classRes = await http
      .post('/classes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        sportId,
        description: 'Intermediate Tennis Class',
        duration: 90,
      })
      .expect(201);

    classId = classRes.body.id;
  });

  afterEach(async () => {
    await app.close();
  });

  it('should allow admin to create a class', async () => {
    const res = await http
      .post('/classes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        sportId,
        description: 'Beginner Tennis Class',
        duration: 60,
      })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.sport.id).toBe(sportId);
    expect(res.body.description).toBe('Beginner Tennis Class');
  });

  it('should allow public user to get all classes', async () => {
    const res = await http.get('/classes').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((cls) => cls.id === classId)).toBe(true);
  });

  it('should allow filtering classes by sport', async () => {
    const res = await http.get(`/classes?sports=Tennis`).expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body.some((cls) => cls.sport?.name === 'Tennis')).toBe(true);
  });

  it('should get class details by ID', async () => {
    const res = await http.get(`/classes/${classId}`).expect(200);
    expect(res.body.id).toBe(classId);
    expect(res.body.sport.name).toBe('Tennis');
  });

  it('should allow admin to update a class', async () => {
    const res = await http
      .put(`/classes/${classId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ description: 'Advanced Tennis Class' })
      .expect(200);

    expect(res.body.description).toBe('Advanced Tennis Class');
  });

  it('should allow admin to delete a class', async () => {
    await http
      .delete(`/classes/${classId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });
});
