import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../auth";

// Define the expected structure of the JWT payload
interface UserPayload {
    id: number;
    email: string;
    type: 'user' | 'company';
}

// Extend Express Request to include optional user property
declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}

export class AuthMiddleware {
    /**
     * Express middleware to authenticate JWT from the Authorization header.
     * - Verifies token presence
     * - Decodes and validates token
     * - Attaches user payload to req.user
     * - Rejects with 401 if missing, 403 if invalid/expired
     */
    async authenticateToken(req: Request, res: Response, next: NextFunction) {
        // Extract token from "Bearer <token>" header
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(" ")[1];

        // If no token provided, return 401 Unauthorized
        if (!token) {
            res.status(401).json({ message: "Token not provided" });
            return;
        }

        try {
            // Verify and decode the JWT
            const decoded = verifyToken(token);

            // Ensure decoded payload has expected structure
            if (typeof decoded === "string" || !('id' in decoded)) {
                throw new Error("Invalid token format");
            }

            // Attach decoded user info to request and proceed
            req.user = decoded as UserPayload;
            next();
        } catch (error) {
            // On verification failure, return 403 Forbidden
            res.status(403).json({ message: "Invalid or expired token" });
        }
    }
}
