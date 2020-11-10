import * as Interfaces from '../interfaces/ITransaction';
import { transactionRepository } from "../repo/transactionRepository";

export default class transaction {
    private _transactionRepository: transactionRepository

    constructor() {
        this._transactionRepository = new transactionRepository();
    }
}