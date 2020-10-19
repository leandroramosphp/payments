const createTransactionSchema =
{
    "title": "createTransactionSchema",
    "type": "object",
    "properties": {
        "x-access-token": {
            "type": "string"
        },      
        "amount": {
            "type": "integer"
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
        "cardId": {
            "type": "integer",
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
    "required": ["x-access-token", "mallId", "amount", "currency", "on_behalf_of", "payment_type", "cardId"]
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
]