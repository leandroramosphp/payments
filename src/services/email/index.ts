import { Service, Container, Inject } from 'typedi';
import { ISendEmail, IWebHookEmail, EmailInterface } from '../../interfaces/IEmail';
import sendgridService from './sendgrid';

@Service()
export default class email extends EmailInterface {
    constructor(
        @Inject('logger') private logger: any
    ) {
        super();
    }

    public sendEmail = async (input: ISendEmail): Promise<any> => {
        try {
            const emailServiceInstance = Container.get(sendgridService);
            const sendEmail: any = (await emailServiceInstance.sendEmail(input))
            return Promise.resolve(sendEmail);
        } catch (e) {
            return Promise.reject(e);
        }
    }
}
