export abstract class StoreInteface {
    abstract createStore: (input: IStoreDTOInput) => Promise<{ message: string, erros: any[] }>;
}

export interface IStoreDTOInput {   
    id: string
    storeId: string
    mallId: string
    idPayment: string           
    owner:{
        firstName:string
        lastName:string
        email:string
        phoneNumber:string
        taxPayerId:string
        birthdate:string
    },
    businessName:string
    businessPhone:string
    businessEmail:string
    ein:string
    businessAddress:{
        line1:string
        line2:string
        line3:string
        neighborhood:string
        city:string
        state:string
        postalCode:string
        countryCode:string
    },
    ownerAddress:{
        line1:string
        line2:string
        line3:string
        neighborhood:string
        city:string
        state:string
        postalCode:string
        countryCode:string
    },
    mcc:string
}
