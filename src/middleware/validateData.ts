import { Response } from 'express';
import { body, validationResult} from "express-validator";

export const validateEmail = body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')


export const checkData = (
    req: Request,
    res: Response,
    next: () => void
) => {
    const error = validationResult(req)

    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() })
    }

    next()
}
