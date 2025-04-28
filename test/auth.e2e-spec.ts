import * as request from 'supertest';
import { getApp } from './utils/e2e-globals';

describe('Auth E2E', () => {
  let http: ReturnType<typeof request.agent>;
  let accessToken: string;
  let refreshTokenCookie: string;

  const testUser = {
    email: 'e2euser@example.com',
    password: 'Test1234!',
  };

  beforeEach(async () => {
    const app = getApp();
    http = request(app.getHttpServer());

    await http.post('/auth/register').send(testUser).expect(201);

    const loginRes = await http.post('/auth/login').send(testUser).expect(200);
    accessToken = loginRes.body.access_token;

    const setCookieHeader = loginRes.headers['set-cookie'];
    if (!setCookieHeader) throw new Error('No set-cookie header found');

    const rawCookies = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
    const found = rawCookies.find((cookie) => cookie.startsWith('refresh_token='));
    if (!found) throw new Error('Refresh token cookie not found');
    refreshTokenCookie = found;
  });

  it('should register a new user successfully', async () => {
    const newUser = {
      email: 'newuser@example.com',
      password: 'NewPass123!',
    };

    const res = await http.post('/auth/register').send(newUser).expect(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe(newUser.email);
  });

  it('should not allow duplicate registration', async () => {
    await http.post('/auth/register').send(testUser).expect(409);
  });

  it('should login the user and receive tokens', async () => {
    const res = await http.post('/auth/login').send(testUser).expect(200);
    expect(res.body).toHaveProperty('access_token');
  });

  it('should return current user info via /auth/me', async () => {
    const res = await http
      .get('/auth/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body).toHaveProperty('userId');
    expect(res.body).toHaveProperty('email', testUser.email);
  });

  it('should not refresh token with invalid cookie', async () => {
    await http
      .post('/auth/refresh')
      .set('Cookie', 'refresh_token=invalid')
      .expect(401);
  });

  it('should logout and clear refresh token', async () => {
    const res = await http
      .post('/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.message).toBe('Logged out successfully');

    await http
      .post('/auth/refresh')
      .set('Cookie', refreshTokenCookie)
      .expect(401);
  });

  it('should not allow login with invalid credentials', async () => {
    const invalidUser = {
      email: testUser.email,
      password: 'WrongPassword123!',
    };

    await http.post('/auth/login').send(invalidUser).expect(401);
  });

  it('should not allow refresh token without cookie', async () => {
    await http.post('/auth/refresh').expect(401);
  });
});
