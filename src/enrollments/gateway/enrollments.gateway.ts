import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { UserRole } from '../../users/enums/user-role.enum';
import { EnrollmentEvents } from '../constants/enrollment-events.enum';
import { AbstractEnrollmentsGateway } from '../abstract/enrollments.abstract.gateway';
import { AbstractWsJwtAuthMiddleware } from '../../auth/abstract/jwt-ws.abstract.middleware';

@WebSocketGateway({
  cors: true,
  transports: ['websocket'],
  path: '/socket.io',
})
export class EnrollmentsGateway implements AbstractEnrollmentsGateway, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() private server: Server;
  private readonly logger = new Logger(EnrollmentsGateway.name);

  constructor(private readonly jwtAuthMiddleware: AbstractWsJwtAuthMiddleware) {}

  afterInit(server: Server) {
    server.use((socket, next) => {
      this.jwtAuthMiddleware.use(socket, next);
    });
  }

  handleConnection(client: Socket): void {
    const user = client.data.user;
    if (user?.role === UserRole.ADMIN && user?.sub) {
      const room = `admin-${user.sub}`;
      client.join(room);
    } else {
      client.disconnect();
      this.logger.warn(`Unauthorized client disconnected: ${client.id}`);
    }
  }

  handleDisconnect(client: Socket): void {
    const user = client.data.user;
    if (user?.role === UserRole.ADMIN && user?.sub) {
      const room = `admin-${user.sub}`;
      client.leave(room);
    }
  }

  sendMessageToAdmin(adminId: number, payload: { message: string }): void {
    const room = `admin-${adminId}`;
    this.server.to(room).emit(EnrollmentEvents.USER_ENROLLED, payload);
  }
}
