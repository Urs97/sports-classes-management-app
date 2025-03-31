import { setupE2ETest } from './utils/setup-e2e';
import { UserRole } from '../src/users/enums/user-role.enum';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createAdminAndLogin } from './utils/test-helpers';

describe('Users E2E', () => {
  const newUser = {
    email: 'newuser@e2e.com',
    password: 'UserPass456!',
  };

  let app: INestApplication;
  let http: ReturnType<typeof request.agent>;
  let accessToken: string;
  let userId: string;

  beforeEach(async () => {
    const setup = await setupE2ETest();
    app = setup.app;
    http = setup.http;

    const result = await createAdminAndLogin(http, setup.dataSource, {
      email: 'admin@users.com',
      password: 'Admin123!',
    });

    accessToken = result.accessToken;

    const createRes = await http
      .post('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(newUser)
      .expect(201);

    userId = createRes.body.id;
  });

  afterEach(async () => {
    await app.close();
  });

  it('should create a new user as admin', async () => {
    expect(userId).toBeDefined();
  });

  it('should fetch all users', async () => {
    const res = await http
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((u) => u.email === newUser.email)).toBe(true);
  });

  it('should fetch a user by ID', async () => {
    const res = await http
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.email).toBe(newUser.email);
  });

  it('should update user role', async () => {
    const res = await http
      .put(`/users/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ role: UserRole.ADMIN })
      .expect(200);

    expect(res.body.role).toBe(UserRole.ADMIN);
  });

  it('should delete the user', async () => {
    await http
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });
});
