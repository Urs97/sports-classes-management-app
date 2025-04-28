import { User } from '../src/users/entities/user.entity';
import { UserRole } from '../src/users/enums/user-role.enum';
import * as request from 'supertest';
import { connectAdminSocket } from './helpers/ws-helpers';
import { EnrollmentEvents } from '../src/enrollments/constants/enrollment-events.enum';
import { getApp, getDataSource } from './utils/e2e-globals';

describe('Enrollments WebSocket Notifications (E2E)', () => {
  jest.setTimeout(20000);

  const student = { email: 'student@e2e.com', password: 'Student123!' };
  const admin = { email: 'admin@e2e.com', password: 'Admin123!' };

  let http: ReturnType<typeof request.agent>;
  let accessToken: string;
  let adminAccessToken: string;
  let classId: number;
  let socket: any;

  beforeEach(async () => {
    const app = getApp();
    http = request(app.getHttpServer());

    const dataSource = getDataSource();
    const userRepo = dataSource.getRepository(User);

    await http.post('/auth/register').send(student).expect(201);
    const loginStudent = await http.post('/auth/login').send(student).expect(200);
    accessToken = loginStudent.body.access_token;

    await http.post('/auth/register').send(admin).expect(201);
    const adminEntity = await userRepo.findOneByOrFail({ email: admin.email });
    adminEntity.role = UserRole.ADMIN;
    await userRepo.save(adminEntity);
    const loginAdmin = await http.post('/auth/login').send(admin).expect(200);
    adminAccessToken = loginAdmin.body.access_token;

    const sportRes = await http
      .post('/sports')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({ name: 'Boxing' })
      .expect(201);

    const classRes = await http
      .post('/classes')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({
        sportId: sportRes.body.id,
        description: 'Boxing Basics',
        duration: 60,
      })
      .expect(201);

    classId = classRes.body.id;
  });

  afterAll(async () => {
    if (socket && socket.connected) {
      socket.disconnect();
    }
  });

  it('should successfully connect the admin WebSocket client', async () => {
    socket = await connectAdminSocket(adminAccessToken);
  
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Connection timeout'));
      }, 5000);
  
      if (socket.connected) {
        clearTimeout(timeout);
        return resolve();
      }
  
      socket.on('connect', () => {
        clearTimeout(timeout);
        resolve();
      });
  
      socket.on('connect_error', (err) => {
        clearTimeout(timeout);
        console.error('[TEST] Socket connect error:', err.message);
        reject(err);
      });
    });
  
    expect(socket.connected).toBe(true);
  });  

  it('should notify admin via WebSocket when student enrolls', async () => {
    let receivedMessage: any = null;
  
    const messageReceived = new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('[TEST] No WebSocket notification received within 5 seconds'));
      }, 5000);
  
      socket.on(EnrollmentEvents.USER_ENROLLED, (data) => {
        clearTimeout(timeout);
        receivedMessage = data;
        resolve();
      });
    });
  
    await http
      .post('/enrollments')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ classId })
      .expect(201);
  
    await messageReceived;
  
    expect(receivedMessage).toHaveProperty('message');
  });

  it('should fail to connect WebSocket without token', async () => {
    await expect(
      new Promise<void>((resolve, reject) => {
        const socket = require('socket.io-client')('ws://localhost:3001', {
          path: '/socket.io',
          transports: ['websocket'],
          auth: {}, // No token provided
        });
  
        socket.on('connect', () => {
          socket.disconnect();
          reject(new Error('[TEST] Socket should not connect without token'));
        });
  
        socket.on('connect_error', (err: Error) => {
          expect(err.message).toContain('Token missing');
          resolve();
        });
      }),
    ).resolves.not.toThrow();
  }, 10000);
});
