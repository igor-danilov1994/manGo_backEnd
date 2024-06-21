import jwt from "jsonwebtoken";
import { RequestWithUser } from "../types";
import { Response } from 'express';

export const checkUserAuth = (
    req: RequestWithUser,
    res: Response,
    next: () => void
) => {
    const token = req.headers['authorization']?.split(' ')[1]
    const SECRET_KEY = process.env.SECRET_KEY ?? ''

    if (!token) {
        return res.status(401).json({ error: 'Token is required!' })
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err){
            return res.status(400).json({ error: "Invalid token" })
        }

        //@ts-ignore
        req.user = user as RequestWithUser
        next()
    })
}
