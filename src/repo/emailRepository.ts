import sequelize from '../loaders/sequelize';
import { QueryTypes } from 'sequelize';
import constants from '../config';

export class emailRepository {
  async getClientDataListEvent(email: string): Promise<any> {
    return await sequelize.query(`
        SELECT 
        *
      FROM 
        client c 
        JOIN client_mall cm ON (cm.client_id = c.id)
      WHERE 
        email = :email
      `, {
      replacements: {
        email: email,
      }, type: QueryTypes.SELECT
    });
  }
}



