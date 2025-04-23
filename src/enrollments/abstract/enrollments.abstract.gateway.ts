import { Socket } from 'socket.io';

export abstract class AbstractEnrollmentsGateway {
    abstract handleConnection(client: Socket): void;
    abstract handleDisconnect(client: Socket): void;
    abstract sendMessageToAdmin(adminId: number, payload: { message: string }): void;
}
