import { setupE2ETest } from './utils/setup-e2e';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createAdminAndLogin } from './utils/test-helpers';

describe('Schedules E2E', () => {
  let app: INestApplication;
  let http: ReturnType<typeof request.agent>;
  let accessToken: string;
  let classId: number;

  beforeEach(async () => {
    const setup = await setupE2ETest();
    app = setup.app;
    http = setup.http;

    const result = await createAdminAndLogin(http, setup.dataSource, {
      email: 'admin@schedules.com',
      password: 'Admin123!',
    });

    accessToken = result.accessToken;

    const sportRes = await http
      .post('/sports')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Running' })
      .expect(201);

    const classRes = await http
      .post('/classes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        sportId: sportRes.body.id,
        description: '5K Run Prep',
        duration: 60,
      })
      .expect(201);

    classId = classRes.body.id;
  });

  afterEach(async () => {
    await app.close();
  });

  it('should create a schedule for a class', async () => {
    const res = await http
      .post('/schedules')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        classId,
        date: new Date().toISOString(),
        duration: 60,
      })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.class.id).toBe(classId);
  });

  it('should list all schedules', async () => {
    await http
      .post('/schedules')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        classId,
        date: new Date().toISOString(),
        duration: 60,
      });

    const res = await http
      .get('/schedules')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should return schedule by ID', async () => {
    const createRes = await http
      .post('/schedules')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        classId,
        date: new Date().toISOString(),
        duration: 60,
      });

    const id = createRes.body.id;

    const res = await http
      .get(`/schedules/${id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body).toHaveProperty('id', id);
  });

  it('should return 404 for non-existing schedule', async () => {
    await http
      .get('/schedules/999999')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);
  });

  it('should update a schedule', async () => {
    const createRes = await http
      .post('/schedules')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        classId,
        date: new Date().toISOString(),
        duration: 60,
      });

    const id = createRes.body.id;

    const res = await http
      .put(`/schedules/${id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ duration: 75 })
      .expect(200);

    expect(res.body.duration).toBe(75);
  });

  it('should delete a schedule', async () => {
    const createRes = await http
      .post('/schedules')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        classId,
        date: new Date().toISOString(),
        duration: 60,
      });

    const id = createRes.body.id;

    await http
      .delete(`/schedules/${id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });

  it('should return 404 when deleting non-existing schedule', async () => {
    await http
      .delete('/schedules/999999')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);
  });
});
