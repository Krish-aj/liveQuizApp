import http from 'http';
import express, {} from "express";
import cors from "cors";
import { Server } from "socket.io";
import { socketAuthMiddleware } from "../auth.js";
export class IoManager {
    static io;
    static app;
    static httpServer;
    static getApp() {
        this.init();
        return this.app;
    }
    static getIo() {
        this.init();
        return this.io;
    }
    static getHttpServer() {
        this.init();
        return this.httpServer;
    }
    static init() {
        if (this.httpServer)
            return;
        this.app = express();
        this.app.use(cors({
            origin: 'http://localhost:5173',
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        }));
        this.app.use(express.json());
        this.httpServer = http.createServer(this.app);
        this.io = new Server(this.httpServer, { cors: { origin: "*", methods: ["GET", "POST"] } });
        this.io.use(socketAuthMiddleware);
    }
}
//# sourceMappingURL=IoManager.js.map