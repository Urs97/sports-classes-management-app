import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards, Logger } from '@nestjs/common';
import { JwtWsGuard } from '../../auth/guards/jwt-ws.guard';
import { AbstractEnrollmentsGateway } from '../abstract/enrollments.abstract.gateway';
import { UserRole } from '../../users/enums/user-role.enum';
import { EnrollmentEvents } from '../constants/enrollment-events.constant';

@UseGuards(JwtWsGuard)
@WebSocketGateway()
export class EnrollmentsGateway
  extends AbstractEnrollmentsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private server: Server;

  private readonly logger = new Logger(EnrollmentsGateway.name);

  handleConnection(client: Socket): void {
    const user = (client as any).user;

    if (user?.role === UserRole.ADMIN && user.userId) {
      client.join(`admin-${user.userId}`);
      this.logger.log(`Admin ${user.userId} connected and joined room admin-${user.userId}`);
    } else {
      this.logger.warn(
        `Socket connection attempt rejected: Invalid or unauthorized user. Payload: ${JSON.stringify(
          user,
        )}`,
      );
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket): void {
    const user = (client as any).user;

    if (user?.role === UserRole.ADMIN && user.userId) {
      client.leave(`admin-${user.userId}`);
      this.logger.log(`Admin ${user.userId} disconnected and left room admin-${user.userId}`);
    }
  }

  sendMessageToAdmin(adminId: number, payload: { message: string }): void {
    this.server.to(`admin-${adminId}`).emit(EnrollmentEvents.USER_ENROLLED, payload);
    this.logger.log(`Sent message to admin-${adminId}: ${JSON.stringify(payload)}`);
  }
}
