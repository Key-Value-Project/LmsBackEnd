import { NextFunction, Request, Response } from 'express';
import HttpException from '../execptions/http.exceptions';

const errorMiddleware = (error: Error, req: Request, res: Response, next: NextFunction) => {
    try {
        if (error instanceof HttpException) {
            const status: number = error.status || 500;
            // const errors: string[] = error.errors || [];
            const message: string = error.message || 'Something went wrong';
            let respbody = { status, message, errors: error.errors };
            res.status(status).json(respbody);
        } else {
            console.error(error.stack);
            res.status(500).send({ error: error.message });
        }
    } catch (error) {
        next(error);
    }
};

export default errorMiddleware;
