// core of auth system

import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import type { Socket } from "socket.io"


type SocketNextFn = (err?: Error) => void;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!; // ! converts string | undefined into pure string 
const JWT_SECRET = process.env.JWT_SECRET!;
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

export interface GoogleProfile {
    googleId: string;
    email: string;
    name: string;
    picture: string | undefined;
}

export async function verifyGoogleToken(idToken: string): Promise<GoogleProfile> {
    const ticket = await googleClient.verifyIdToken({ idToken, audience: GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    if (!payload || !payload.sub || !payload.email) {
        throw new Error("Invalid Google token payload");
    }
    return {
        googleId: payload.sub,
        email: payload.email,
        name: payload.name ?? payload.email,
        picture: payload.picture,
    }
}


export interface SessionClaims {
    adminId: string;
    email: string;
}

export function issueSessionToken(claims: SessionClaims): string {
    return jwt.sign(claims, JWT_SECRET, { expiresIn: "1d" });
}

export function verifySessionToken(token: string): SessionClaims {
    return jwt.verify(token, JWT_SECRET) as SessionClaims;
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) {
        res.status(401).json({ error: "missing token" });
        return;
    }
    try {
        (req as Request & { admin: SessionClaims }).admin = verifySessionToken(token);
        next();
    } catch {
        res.status(401).json({ error: "invalid or expired token" });
    }
}

export function socketAuthMiddleware(socket: Socket, next: SocketNextFn) {
    const token = socket.handshake.auth?.token as string | undefined;
    if (token) {
        try {
            const claims = verifySessionToken(token);
            socket.data.adminId = claims.adminId;
        } catch (err) {
            console.log(err);
            //invalid token
        }
    }
    next();
}