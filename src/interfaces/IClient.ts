export abstract class ClientInteface {
    abstract createClient: (input: IClientDTOInput) => Promise<{ message: string, erros: any[] }>;
}

export interface IClientDTOInput {   
    id: string
    clientId: string
    mallId: string
    id_zoop: string
    username:string
    authorization: string
    password:string    
    marketPlaceId: string
    first_name:string
    last_name: string
    taxpayer_id:string
    email:string
    address:{
        line1:string
        line2:string
        neighborhood:string
        city:string
        state:string
        postal_code:string
        country_code:string
    }
    metadata?:{
        "twitter.id?": string;
        "facebook.user_id?": string
        "my-own-customer-id?": string
    }
}
