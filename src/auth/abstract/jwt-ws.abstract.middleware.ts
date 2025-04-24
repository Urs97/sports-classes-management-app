import { Socket } from "socket.io";

export abstract class AbstractWsJwtAuthMiddleware {
    abstract use(socket: Socket, next: (err?: Error) => void): void;
}