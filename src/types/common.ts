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


export interface CustomUserType {
    id: string;
    email: string;
}

export interface RequestWithUser extends Request {
    user?: CustomUserType;
}

export type Nullable<T> = T | null | undefined;

export const HTTP_STATUS = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,
    BAD_REQUEST_400: 400,
    UNAUTHORIZED_401: 401,
    FORBIDDEN_403: 403,
    NOT_FOUND_404: 404,
    TOO_MANY_REQUESTS_429: 429,
    INTERNAL_SERVER_ERROR: 500
}
