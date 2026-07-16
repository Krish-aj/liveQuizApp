import type { Request, Response, NextFunction } from "express";
import type { Socket } from "socket.io";
type SocketNextFn = (err?: Error) => void;
export interface GoogleProfile {
    googleId: string;
    email: string;
    name: string;
    picture: string | undefined;
}
export declare function verifyGoogleToken(idToken: string): Promise<GoogleProfile>;
export interface SessionClaims {
    adminId: string;
    email: string;
}
export declare function issueSessionToken(claims: SessionClaims): string;
export declare function verifySessionToken(token: string): SessionClaims;
export declare function requireAdmin(req: Request, res: Response, next: NextFunction): void;
export declare function socketAuthMiddleware(socket: Socket, next: SocketNextFn): void;
export {};
//# sourceMappingURL=auth.d.ts.map