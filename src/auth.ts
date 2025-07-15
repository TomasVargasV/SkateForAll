// auth.ts
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
    throw new Error('Variável de ambiente JWT_SECRET não definida');
}

const secret: Secret = JWT_SECRET;

// Interface para o payload do token
interface TokenPayload extends JwtPayload {
    id: number;
    email: string;
    type: 'user' | 'company';
}

export function generateToken(payload: TokenPayload) {
    return jwt.sign(payload, secret, { expiresIn: "1h" });
}

export function verifyToken(token: string): TokenPayload {
    return jwt.verify(token, secret) as TokenPayload;
}