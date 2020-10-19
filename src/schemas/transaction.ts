const createTransactionSchema =
{
    "title": "createTransactionSchema",
    "type": "object",
    "properties": {
        "x-access-token": {
            "type": "string"
        },              
        "cpf": {
            "type": "string",
            "maxLength": 11,
            "minLength": 11,
            "pattern": "^[0-9]+$"
        },
        "amount": {
            "type": "integer"
        },
        "mallId": {
            "type": "string",
            "pattern": "^[0-9]+$"
        },
        "portion": {
            "type": "integer",
            "pattern": "^[1-9]?$|^12$"
        },
        "currency": {
            "type": "string"
        },    
        "description": {
            "type": "string",
        },     
        "on_behalf_of": {
            "type": "string",
        },
        "token": {
            "type": "string",
        },  
        "payment_type": {
            "type": "string",
        },
        "clientId": {
            "type": "string",
        },
        "split_rules": {
            "type": "array",
            "recipient": {
                "type": "string",
            },
            "percentage": {
                "type": "integer",
            },
            "required": ["recipient", "percentage"]
        },
    },
    "required": ["x-access-token", "mallId", "amount", "currency", "on_behalf_of", "payment_type", "clientId", "description"]
}

const updateTransactionSchema =
{
    "title": "updateTransactionSchema",
    "type": "object",
    "properties": {
        "x-access-token": {
            "type": "string"
        },      
        "mallId": {
            "type": "string",
            "pattern": "^[0-9]+$"
        },
        "on_behalf_of": {
            "type": "integer",
        },
        "amount": {
            "type": "integer",
        },
        "cpf": {
            "type": "string",
            "maxLength": 11,
            "minLength": 11,
            "pattern": "^[0-9]+$"
        }    
    },
    "required": ["x-access-token", "mallId", "on_behalf_of", "amount"]
}


const updateTransactionReverseSchema =
{
    "title": "updateTransactionReverseSchema",
    "type": "object",
    "properties": {
        "x-access-token": {
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

const updateTransactionApproveSchema =
{
    "title": "updateTransactionApproveSchema",
    "type": "object",
    "properties": {
        "x-access-token": {
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


const getAllTransactionSchema =
{
    "title": "getAllTransactionSchema",
    "type": "object",
    "properties": {
        "x-access-token": {
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
        name: "createTransactionSchema",
        schema: createTransactionSchema
    },
    {
        name: "updateTransactionSchema",
        schema: updateTransactionSchema
    },
    {
        name: "updateTransactionReverseSchema",
        schema: updateTransactionReverseSchema
    },
    {
        name: "updateTransactionApproveSchema",
        schema: updateTransactionApproveSchema
    },
    {
        name: "getAllTransactionSchema",
        schema: getAllTransactionSchema
    }
]