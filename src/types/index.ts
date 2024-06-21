import { Request, Response } from 'express';
import jwt from "jsonwebtoken";

export type CustomResponse<T> = Response<T>
export type CustomRequest = Request

export type RequestWithBody<T> = Request<{}, {}, T>
export type RequestWithQuery<T> = Request<{}, {}, {}, T>
export type RequestWithParams<T> = Request<T>


export interface RequestWithUser extends Request {
    user: { id: string, iat: number }
}

