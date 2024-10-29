import {Response, NextFunction} from 'express';
import {body, validationResult} from "express-validator";
import {RequestWithBody} from "../types/common";
import {LoginRequest} from "../types/user";

export class ValidatorMiddleware {
    static validateEmail = body('email')
        .isEmail()
        .withMessage('Please enter a valid email address');

    static checkData = (
        req: RequestWithBody<LoginRequest>,
        res: Response,
        next: NextFunction
    ) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }

        next();
    };
}
