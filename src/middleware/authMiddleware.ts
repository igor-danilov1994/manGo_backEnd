import jwt from "jsonwebtoken";
import { Response, NextFunction } from 'express';
import { CustomUserType, HTTP_STATUS, RequestWithUser } from "../types/common";

export class AuthMiddleware {
    constructor() {}

    public checkUserAuth(req: RequestWithUser, res: Response, next: NextFunction) {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(HTTP_STATUS.UNAUTHORIZED_401).json({ error: 'Authorization header is required!' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(HTTP_STATUS.UNAUTHORIZED_401).json({ error: 'Token is required!' });
        }

        const secretKey = process.env.SECRET_KEY;
        if (!secretKey) {
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Secret key is missing!' });
        }

        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                return res.status(HTTP_STATUS.UNAUTHORIZED_401).json({ error: "Invalid token" });
            }

            req.user = user as CustomUserType;
            next();
        });
    }
}

