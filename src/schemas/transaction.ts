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
        "storeId": {
            "type": "string",
            "pattern": "^[0-9]+$"
        },
        "mallId": {
            "type": "string",
            "pattern": "^[0-9]+$"
        },
        "id": {
            "type": "string",
            "pattern": "^[0-9]+$"
        },
        "invoiceNumber": {
            "type": "string",
            "pattern": "^[0-9]+$"
        }
    },
    "required": ["storeId", "mallId", "id", "invoiceNumber"]
}

const rejectTransactionSchema =
{
    "title": "rejectTransactionSchema",
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
        "id": {
            "type": "string",
            "pattern": "^[0-9]+$"
        }
    },
    "required": ["storeId", "mallId", "id"]
}

const getAllTransactionsSchema =
{
    "title": "getAllTransactionsSchema",
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
        "origin": {
            "type": "string",
            "enum": [
                "creditcard",
                "cashback"
            ]
        },
        "status": {
            "type": "string",
            "enum": [
                "pending",
                "succeeded",
                "refunded"
            ]
        },
        "startDate": {
            "type": "string",
            "format": "date"
        },
        "endDate": {
            "type": "string",
            "format": "date"
        },
        "search": {
            "type": "string"
        },
        "limit": {
            "type": "string",
            "pattern": "^[0-9]+$"
        },
        "page": {
            "type": "string",
            "pattern": "^[0-9]+$"
        },
        "column": {
            "type": "string",
            "pattern": "^[0-9]+$"
        },
        "order": {
            "type": "string",
            "enum": [
                "asc",
                "desc"
            ]
        }
    },
    "required": ["storeId", "mallId"]
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