const createTransactionSchema =
{
    "title": "createTransactionSchema",
    "type": "object",
    "properties": {
        "storeId": {
            "type": "string",
            "pattern": "^[0-9]+$"
        },
        "mallId": {
            "type": "string",
            "pattern": "^[0-9]+$"
        },
        "clientId": {
            "type": "number"
        },
        "value": {
            "type": "number"
        },
        "installments": {
            "type": "number"
        },
        "creditCardId": {
            "type": "number"
        }
    },
    "required": ["storeId", "mallId", "clientId", "value", "creditCardId"]
}

const acceptTransactionSchema =
{
    "title": "acceptTransactionSchema",
    "type": "object",
    "properties": {
    },
    "required": []
}

const rejectTransactionSchema =
{
    "title": "rejectTransactionSchema",
    "type": "object",
    "properties": {
    },
    "required": []
}

const getAllTransactionsSchema =
{
    "title": "getAllTransactionsSchema",
    "type": "object",
    "properties": {
    },
    "required": []
}

export default [
    {
        name: "createTransactionSchema",
        schema: createTransactionSchema
    },
    {
        name: "acceptTransactionSchema",
        schema: acceptTransactionSchema
    },
    {
        name: "rejectTransactionSchema",
        schema: rejectTransactionSchema
    },
    {
        name: "getAllTransactionsSchema",
        schema: getAllTransactionsSchema
    }
]