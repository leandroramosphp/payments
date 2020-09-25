export abstract class EmailInterface {
    abstract sendEmail: (input: ISendEmail) => Promise<{ message: string, erros: any[] }>;
}

export interface ISendEmail {
    emailId: number
    content: string;
    subject: string;
    clientIds: number[];
    response: any
    emails: any
    mallId: number;
    true: any
    comm: any
    sourceType?: any
}
