import { emailRepository } from "../repo/emailRepository";

export default class Email implements Email {
    private _emailRepository: emailRepository

    constructor() {
        this._emailRepository = new emailRepository();
    }

    async getClientDataListEvent(email: string): Promise<any> {
        return await this._emailRepository.getClientDataListEvent(email);
    }
}