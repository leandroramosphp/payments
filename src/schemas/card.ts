const createCardSchema =
{
    "title": "createCardSchema",
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
    "required": ["x-access-token", "token", "mallId", "cpf"]
}

const deleteCardSchema =
{
    "title": "deleteCardSchema",
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


const getAllCardSchema =
{
    "title": "getAllCardSchema",
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
        name: "createCardSchema",
        schema: createCardSchema
    },
    {
        name: "deleteCardSchema",
        schema: deleteCardSchema
    },
    {
        name: "getAllCardSchema",
        schema: getAllCardSchema
    }
]