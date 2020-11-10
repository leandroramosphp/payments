import { Request, Response, NextFunction } from 'express';

let mosAuth = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const mallId = parseInt(req.query.mallId);
        if (!mallId || !req.headers['x-access-token']) {
            const errorMessage = !mallId ? 'Unauthorized - mallId is required.' : 'Unauthorized - x-access-token is required.'
            return res.status(401).json({
                message: errorMessage
            });
        }
        /* TODO - Implementar lógica para autenticação da API */
        next();
    }
}

export default mosAuth;