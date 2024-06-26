import { Request, Response } from 'express';

export interface ErrorType {
    error: string
}

export type CustomResponse<T> = Response<T | ErrorType>
export type CustomRequest = Request

export type RequestWithBody<T> = Request<{}, {}, T>
export type RequestWithQuery<T> = Request<{}, {}, {}, T>
export type RequestWithParams<T> = Request<T>


export interface RequestWithUser extends Request {
    user: { id: string, iat: number }
}

