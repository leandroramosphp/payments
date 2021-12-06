const createCreditCardSchema =
{
    "title": "createCreditCardSchema",
    "type": "object",
    "properties": {
        "clientId": {
            "type": "integer",
        },
        "creditCardToken": {
            "type": "string"
        },
        "mallId": {
            "type": "string",
            "pattern": "^[0-9]+$"
        }
    },
    "required": ["clientId", "creditCardToken", "mallId"]
}

const disableCreditCardSchema =
{
    "title": "disableCreditCardSchema",
    "type": "object",
    "properties": {
        "clientId": {
            "type": "string",
            "pattern": "^[0-9]+$"
        },
        "id": {
            "type": "string",
            "pattern": "^[0-9]+$"
        },
        "mallId": {
            "type": "string",
            "pattern": "^[0-9]+$"
        }
    },
    "required": ["clientId", "id", "mallId"]
}

const getCreditCardsSchema =
{
    "title": "getCreditCardsSchema",
    "type": "object",
    "properties": {
        "clientId": {
            "type": "string",
            "pattern": "^[0-9]+$"
        },
        "mallId": {
            "type": "string",
            "pattern": "^[0-9]+$"
        }
    },
    "required": ["clientId", "mallId"]
}

export default [
    {
        name: "createCreditCardSchema",
        schema: createCreditCardSchema
    },
    {
        name: "disableCreditCardSchema",
        schema: disableCreditCardSchema
    },
    {
        name: "getCreditCardsSchema",
        schema: getCreditCardsSchema
    }
]