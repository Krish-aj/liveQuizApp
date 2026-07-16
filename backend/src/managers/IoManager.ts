import http from 'http';
import express ,{ type Express } from "express"
import cors from "cors"
import { Server } from "socket.io"
import { socketAuthMiddleware } from "../auth.js"

export class IoManager{
    private static io: Server;
    private static app: Express;
    private static httpServer: http.Server;

    public static getApp():Express{
        this.init();
        return this.app;
    }

    public static getIo():Server{
        this.init();
        return this.io;
    }

    public static getHttpServer():http.Server{
        this.init();
        return this.httpServer;
    }

    private static init(){
        if(this.httpServer) return;
        this.app=express();
        this.app.use(cors({
            origin:'http://localhost:5173',
            credentials:true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        }));
        this.app.use(express.json());
        this.httpServer= http.createServer(this.app)
        this.io= new Server(this.httpServer, 
            {cors:{origin:"*",methods:["GET", "POST"]}});
            this.io.use(socketAuthMiddleware);
    }

}