import jwt from 'jsonwebtoken';
import { RequestWithUser } from '../utils/requestWithUser';
import { NextFunction, Response } from 'express';
import { JwtPayload } from '../utils/jwtPayload';
import HttpException from '../execptions/http.exceptions';

const getTokenFromHeader = (req: RequestWithUser) => {
    const bearerToken = req.header('Authorization');
    const token = bearerToken ? bearerToken.replace('Bearer ', '') : '';
    return token;
};

const authorize = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const token = getTokenFromHeader(req);
        if (!token) {
            throw new HttpException(401, 'Unauthorized', ['Token not found']);
        }
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if (!payload) {
            throw new HttpException(401, 'Unauthorized', ['Invalid token']);
        }

        req.name = (payload as JwtPayload).name;
        req.email = (payload as JwtPayload).email;
        req.role = (payload as JwtPayload).role;
        req.id = (payload as JwtPayload).id;

        return next();
    } catch (err) {
        return next(err);
    }
};

export default authorize;
