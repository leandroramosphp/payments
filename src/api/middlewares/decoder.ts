import { Request, Response, NextFunction } from 'express';
import logger from '../../loaders/logger';
import crypto from 'crypto'
import config from '../../config';
async function decoder(req: Request, res: Response, next: NextFunction) {
  try {
    if (res.locals.data.storeCode) {
      console.log('entroooooou aqui');
      
      const algorithm = config.encryption.algorithm
      const key = config.encryption.key
      const iv = config.encryption.iv

      if (!crypto.createDecipheriv(algorithm, key, iv)) {
        throw ({
          status: 400,
          message: "Identificador da loja inválido. Escaneie o QR Code novamente."
        })
      }

      const decipher = crypto.createDecipheriv(algorithm, key, iv)
      let deciphered: any = decipher.update(res.locals.data.storeCode, 'hex', 'utf-8')
      deciphered += decipher.final('utf-8')

      if (isNaN(deciphered)) {
        throw ({
          status: 400,
          message: "Identificador da loja inválido. Escaneie o QR Code novamente."
        })
      }
      
      res.locals.data.storeId = +deciphered
    
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

