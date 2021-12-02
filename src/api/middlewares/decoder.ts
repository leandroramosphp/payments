import { Request, Response, NextFunction } from 'express';
import logger from '../../loaders/logger';
import crypto from 'crypto'
import config from '../../config';
async function decoder(req: Request, res: Response, next: NextFunction) {
  try {
    console.log('entrou aqui');
    
    if (typeof (req.body.storeId) === 'string') {
      const algorithm = config.encryption.algorithm
      const key = config.encryption.key
      const iv = config.encryption.iv

      const decipher = crypto.createDecipheriv(algorithm, key, iv)
      let deciphered = decipher.update(req.body.storeId, 'hex', 'utf-8')
      deciphered += decipher.final('utf-8')
      
      if (!+deciphered) {
        throw ({
          status: 500,
          message: "Identificador da loja inválido. Escaneie o QR Code novamente."
        })
      }

      req.body.storeId = +deciphered

      next();
    } else {
      next();
    }
  } catch (e) {
    logger.error(e);
    return next(e);
  }
}

export default decoder

