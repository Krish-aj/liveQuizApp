import type { Socket } from "socket.io";
export declare class AdminManager {
    private users;
    private quizManager;
    constructor();
    adduser(roomId: string, socket: Socket): void;
    private createHandlers;
}
//# sourceMappingURL=AdminManager.d.ts.map