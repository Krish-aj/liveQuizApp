// core of auth system
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID; // ! converts string | undefined into pure string 
const JWT_SECRET = process.env.JWT_SECRET;
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);
export async function verifyGoogleToken(idToken) {
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
    };
}
export function issueSessionToken(claims) {
    return jwt.sign(claims, JWT_SECRET, { expiresIn: "1d" });
}
export function verifySessionToken(token) {
    return jwt.verify(token, JWT_SECRET);
}
export function requireAdmin(req, res, next) {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) {
        res.status(401).json({ error: "missing token" });
        return;
    }
    try {
        req.admin = verifySessionToken(token);
        next();
    }
    catch {
        res.status(401).json({ error: "invalid or expired token" });
    }
}
export function socketAuthMiddleware(socket, next) {
    const token = socket.handshake.auth?.token;
    if (token) {
        try {
            const claims = verifySessionToken(token);
            socket.data.adminId = claims.adminId;
        }
        catch (err) {
            console.log(err);
            //invalid token
        }
    }
    next();
}
//# sourceMappingURL=auth.js.map