export abstract class ClientInteface {
    abstract createClient: (input: IClientDTOInput) => Promise<{ message: string, erros: any[] }>;
}

export interface IClientDTOInput {   
    id: string
    clientId: string
    mallId: string
    idpayment: string  
    firstName:string
    lastName: string
    email: string
    phoneNumber: string
    taxpayerId: string
    birthdate: string
    address:{
        line1:string
        line2:string
        neighborhood:string
        city:string
        state:string
        postalCode:string
        countryCode:string
    }
}
