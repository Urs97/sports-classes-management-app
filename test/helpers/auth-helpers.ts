import { User } from '../../src/users/entities/user.entity';
import { UserRole } from '../../src/users/enums/user-role.enum';
import * as request from 'supertest';
import { getDataSource } from '../utils/e2e-globals';

interface CreateAdminResult {
  accessToken: string;
  user: User;
}

export const createAdminAndLogin = async (
  http: ReturnType<typeof request.agent>,
  adminUser = {
    email: 'admin@e2e.com',
    password: 'Admin123!',
  }
): Promise<CreateAdminResult> => {
  const dataSource = getDataSource();

  await http.post('/auth/register').send(adminUser).expect(201);

  const userRepo = dataSource.getRepository(User);
  const userEntity = await userRepo.findOneByOrFail({ email: adminUser.email });
  userEntity.role = UserRole.ADMIN;
  await userRepo.save(userEntity);

  const loginRes = await http.post('/auth/login').send(adminUser).expect(200);
  const accessToken = loginRes.body.access_token;

  return { accessToken, user: userEntity };
};
