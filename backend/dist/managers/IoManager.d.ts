import http from 'http';
import { type Express } from "express";
import { Server } from "socket.io";
export declare class IoManager {
    private static io;
    private static app;
    private static httpServer;
    static getApp(): Express;
    static getIo(): Server;
    static getHttpServer(): http.Server;
    private static init;
}
//# sourceMappingURL=IoManager.d.ts.map