import { Request, Response, NextFunction } from 'express';
import config from '../../config';

let internalAuth = () => {

    return async (req: Request, res: Response, next: NextFunction) => {
        if(!req.headers['x-api-key'] || req.headers['x-api-key'] != config.api.internalApiKey) {
            return res.status(401).json({
                message: 'Unauthorized - invalid x-api-key.'
            });
        }
        next();
    }
}

export default internalAuth;