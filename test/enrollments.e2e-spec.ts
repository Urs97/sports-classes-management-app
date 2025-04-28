import { User } from '../src/users/entities/user.entity';
import { UserRole } from '../src/users/enums/user-role.enum';
import * as request from 'supertest';
import { getApp, getDataSource } from './utils/e2e-globals';

describe('Enrollments E2E', () => {
  const user = { email: 'student@e2e.com', password: 'Student123!' };
  const admin = { email: 'admin@e2e.com', password: 'Admin123!' };

  let http: ReturnType<typeof request.agent>;
  let userId: number;
  let classId: number;
  let accessToken: string;
  let adminAccessToken: string;

  beforeEach(async () => {
    const app = getApp();
    http = request(app.getHttpServer());

    const dataSource = getDataSource();
    const userRepo = dataSource.getRepository(User);

    // Register + login user
    await http.post('/auth/register').send(user).expect(201);
    const userEntity = await userRepo.findOneByOrFail({ email: user.email });
    userId = userEntity.id;

    const loginUserRes = await http.post('/auth/login').send(user).expect(200);
    accessToken = loginUserRes.body.access_token;

    // Register + promote + login admin
    await http.post('/auth/register').send(admin).expect(201);
    const adminEntity = await userRepo.findOneByOrFail({ email: admin.email });
    adminEntity.role = UserRole.ADMIN;
    await userRepo.save(adminEntity);

    const loginAdminRes = await http.post('/auth/login').send(admin).expect(200);
    adminAccessToken = loginAdminRes.body.access_token;

    const sportRes = await http
      .post('/sports')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({ name: 'Swimming' })
      .expect(201);

    const classRes = await http
      .post('/classes')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({
        sportId: sportRes.body.id,
        description: 'Beginner Swim Class',
        duration: 45,
      })
      .expect(201);

    classId = classRes.body.id;
  });

  it('should allow a user to enroll into a class', async () => {
    const res = await http
      .post('/enrollments')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ classId })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.class.id).toBe(classId);
    expect(res.body.user.id).toBe(userId);
  });

  it('should list all enrollments as admin', async () => {
    await http
      .post('/enrollments')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ classId });

    const res = await http
      .get('/enrollments')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should return enrollments by class ID', async () => {
    await http
      .post('/enrollments')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ classId });

    const res = await http
      .get(`/enrollments/class/${classId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(200);

    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].class.id).toBe(classId);
  });

  it('should return enrollments by user ID', async () => {
    await http
      .post('/enrollments')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ classId });

    const res = await http
      .get(`/enrollments/user/${userId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(200);

    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].user.id).toBe(userId);
  });

  it('should enroll user into a class and prevent duplicate enrollment', async () => {
    const firstRes = await http
      .post('/enrollments')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ classId })
      .expect(201);

    expect(firstRes.body).toHaveProperty('id');
    expect(firstRes.body.class.id).toBe(classId);
    expect(firstRes.body.user.email).toBe(user.email);

    await http
      .post('/enrollments')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ classId })
      .expect(409);
  });
});
