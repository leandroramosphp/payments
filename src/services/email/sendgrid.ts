import { Service, Inject } from 'typedi';
import { ISendEmail, IWebHookEmail, EmailInterface } from '../../interfaces/IEmail';
import emailModel from '../../business/email';
import moment from 'moment';

sgMail.setApiKey(constants.sendgrid.apikey);

@Service()
export default class sendEmailService extends EmailInterface {
  private _emailController: emailModel;

  constructor(
    @Inject('logger') private logger: any
  ) {
    super();
    this._emailController = new emailModel();
  }

  public sendEmail = async (input: ISendEmail): Promise<any> => {
    try {
      this.logger.silly('Calling sendEmail');     
      return Promise.resolve(input);
    } catch (e) {
      return Promise.reject(e);
    }
  }  
}