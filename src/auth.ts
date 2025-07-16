import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Read JWT secret from environment variables
const { JWT_SECRET } = process.env;
// Ensure JWT_SECRET is defined
if (!JWT_SECRET) {
    throw new Error('Environment variable JWT_SECRET is not defined');
}
// Define secret type for JWT operations
const secret: Secret = JWT_SECRET;
/**
 * Extended JwtPayload including application-specific fields.
 */
interface TokenPayload extends JwtPayload {
    id: number;              // User or company ID
    email: string;           // Email associated with the token
    type: 'user' | 'company';// Entity type for authorization logic
}
/**
 * Generates a JWT signed token for a given payload.
 * @param payload - Object containing id, email, and type
 * @returns Signed JWT string (expires in 1 hour)
 */
export function generateToken(payload: TokenPayload) {
    return jwt.sign(payload, secret, { expiresIn: "1h" });
}
/**
 * Verifies and decodes a JWT string.
 * @param token - JWT string to verify
 * @returns Decoded TokenPayload if valid
 * @throws Error if token is invalid or expired
 */
export function verifyToken(token: string): TokenPayload {
    return jwt.verify(token, secret) as TokenPayload;
}
