import * as Interfaces from '../interfaces/IPayment';
import { paymentRepository } from "../repo/paymentRepository";

export default class payment {
    private _paymentRepository: paymentRepository

    constructor() {
        this._paymentRepository = new paymentRepository();
    }

    async createPayment(clientPaymentId: number, storePaymentId: string, installments: number, payments: Array<{ origin: string, value: number, externalId: string }>): Promise<void> {
        try {
            return Promise.resolve(await this._paymentRepository.createPayment(clientPaymentId, storePaymentId, installments, payments));
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async acceptPayment(id: number, invoiceNumber: string): Promise<number> {
        try {
            return Promise.resolve(await this._paymentRepository.acceptPayment(id, invoiceNumber));
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async rejectPayment(id: number): Promise<number> {
        try {
            return Promise.resolve(await this._paymentRepository.rejectPayment(id));
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async getPendingPayment(id: number): Promise<Array<{ externalId: string, origin: string, value: number }>> {
        try {
            return Promise.resolve(await this._paymentRepository.getPendingPayment(id));
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async getAllPayments(input: Interfaces.GetAllPaymentsInput): Promise<{ data: Array<Interfaces.GetAllPaymentsOutput>, total: number }> {
        try {
            return Promise.resolve(await this._paymentRepository.getAllPayments(input));
        } catch (e) {
            return Promise.reject(e);
        }
    }
}