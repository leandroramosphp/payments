import * as Interfaces from '../interfaces/ICreditCard';
import { creditCardRepository } from "../repo/creditCardRepository";

export default class creditCard {
    private _creditCardRepository: creditCardRepository

    constructor() {
        this._creditCardRepository = new creditCardRepository();
    }
}