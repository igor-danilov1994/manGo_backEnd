import { Request, Response } from 'express';
import { ValidationError } from "express-validator";

export interface ErrorType {
    error: string | ValidationError[];
}

export type CustomResponse<T> = Response<T | ErrorType>;
export type CustomRequest = Request;

export type RequestWithBody<T> = Request<object, unknown, T>;
export type RequestWithQuery<T> = Request<object, unknown, unknown, T>;
export type RequestWithParams<T> = Request<T>;

export interface RequestWithUser extends Request {
    user: { id: string; iat: number };
}


export type Nullable<T> = T | null;
