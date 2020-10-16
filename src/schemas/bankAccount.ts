const createBankAccountSchema =
{
    "title": "createBankAccountSchema",
    "type": "object",
    "properties": {
        "x-access-token": {
            "type": "string"
        },      
        "token": {
            "type": "string"
        },
        "customer": {
            "type": "string"
        },    
        "mallId": {
            "type": "string",
            "pattern": "^[0-9]+$"
        },     
        "storePaymentId": {
            "type": "integer"
        },  
    },
    "required": ["x-access-token", "token", "mallId", "storePaymentId"]
}

const updateBankAccountSchema =
{
    "title": "updateBankAccountSchema",
    "type": "object",
    "properties": {
        "x-access-token": {
            "type": "string"
        },      
        "token": {
            "type": "string"
        },
        "customer": {
            "type": "string"
        },    
        "mallId": {
            "type": "string",
            "pattern": "^[0-9]+$"
        },     
        "cpf": {
            "type": "string",
            "maxLength": 11,
            "minLength": 11,
            "pattern": "^[0-9]+$"
        } 
    },
    "required": ["x-access-token", "mallId"]
}


const getAllBankAccountSchema =
{
    "title": "getAllBankAccountSchema",
    "type": "object",
    "properties": {
        "x-access-token": {
            "type": "string"
        },      
        "token": {
            "type": "string"
        },
        "customer": {
            "type": "string"
        },    
        "mallId": {
            "type": "string",
            "pattern": "^[0-9]+$"
        },     
        "cpf": {
            "type": "string",
            "maxLength": 11,
            "minLength": 11,
            "pattern": "^[0-9]+$"
        } 
    },
    "required": ["x-access-token", "mallId"]
}



export default [
    {
        name: "createBankAccountSchema",
        schema: createBankAccountSchema
    },
    {
        name: "updateBankAccountSchema",
        schema: updateBankAccountSchema
    },
    {
        name: "getAllBankAccountSchema",
        schema: getAllBankAccountSchema
    }
]