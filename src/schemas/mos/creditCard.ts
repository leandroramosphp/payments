const createCreditCardSchema =
{
    "title": "createCreditCardSchema",
    "type": "object",
    "properties": {
        "clientId": {
            "type": "integer",
        },
        "encryptedCreditCard": {
            "type": "string"
        },
        "mallId": {
            "type": "string",
            "pattern": "^[0-9]+$"
        }
    },
    "required": ["clientId", "encryptedCreditCard", "mallId"]
}

const disableCreditCardSchema =
{
    "title": "disableCreditCardSchema",
    "type": "object",
    "properties": {
        "clientId": {
            "type": "integer",
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