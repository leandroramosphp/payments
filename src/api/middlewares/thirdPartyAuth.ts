import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import sequelize from '../../loaders/sequelize';
import { QueryTypes } from 'sequelize';

let thirdPartyAuth = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const mallId = parseInt(req.query.mallId);
        if (!mallId || !req.headers['x-partner-key']) {
            const errorMessage = !mallId ? 'Unauthorized - mallId is required.' : 'Unauthorized - x-partner-key is required.'
            return res.status(401).json({
                message: errorMessage
            });
        }
        const hash = crypto.createHash('sha512').update(<crypto.BinaryLike>req.headers['x-partner-key']).digest().toString('hex');
        const mall: any = await sequelize.query(`
            SELECT
                *
            FROM
                mall m
                JOIN app ON (m.app_id = app.id)
            WHERE
                m.id = :mallId
                AND app.partner_id = :hash
    `, { replacements: { mallId: mallId, hash: hash }, type: QueryTypes.SELECT });
        if (mall && mall.length) {
            next();
        } else {
            return res.status(401).json({
                message: 'Unauthorized - x-partner-key is not associated with mallId'
            });
        }
    }
}

export default thirdPartyAuth;