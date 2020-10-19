const createAccountBallanceSchema =
{
    "title": "createAccountBallanceSchema",
    "type": "object",
    "properties": {
        "x-access-token": {
            "type": "string"
        },              
        "mallId": {
            "type": "string",
            "pattern": "^[0-9]+$"
        },     
        "bankName": {
            "type": "integer"
        },
        "clientId": {
            "type": "string"
        },
        "agency": {
            "type": "integer"
        },
        "account": {
            "type": "integer"
        },
        "socialReason": {
            "type": "string"
        },
        "cnpj": {
            "type": "string"
        },
    },
    "required": ["x-access-token", "mallId", "bankName", "clientId", "agency", "account", "socialReason", "cnpj"]
}

const getAccountBallanceSchema =
{
    "title": "getAccountBallanceSchema",
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


const getAllAccountBallanceSchema =
{
    "title": "getAllAccountBallanceSchema",
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


export default [
    {
        name: "createAccountBallanceSchema",
        schema: createAccountBallanceSchema
    },
    {
        name: "getAccountBallanceSchema",
        schema: getAccountBallanceSchema
    },
    {
        name: "getAllAccountBallanceSchema",
        schema: getAllAccountBallanceSchema
    }
]