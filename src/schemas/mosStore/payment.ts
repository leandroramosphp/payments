const createPaymentMosStoreSchema =
{
    "title": "createPaymentMosStoreSchema",
    "type": "object",
    "properties": {
        "storeId": {
            "type": ["integer", "string"],
        },
        "clientId": {
            "type": "number"
        },
        "value": {
            "type": "string",
            "pattern": "-?^\\d*(.\\d{0,2})?$"
        },
        "installments": {
            "type": "number"
        },
        "creditCardId": {
            "type": "number"
        }
    },
    "required": ["storeId", "clientId", "value", "creditCardId", "installments"]
}

const acceptPaymentMosStoreSchema =
{
    "title": "acceptPaymentMosStoreSchema",
    "type": "object",
    "properties": {
        "storeId": {
            "type": ["integer", "string"],
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
    "required": ["storeId", "id", "invoiceNumber"]
}

const rejectPaymentMosStoreSchema =
{
    "title": "rejectPaymentMosStoreSchema",
    "type": "object",
    "properties": {
        "storeId": {
            "type": ["integer", "string"],
        },
        "id": {
            "type": "string",
            "pattern": "^[0-9]+$"
        }
    },
    "required": ["storeId", "id"]
}

const getAllPaymentItemsMosStoreSchema =
{
    "title": "getAllPaymentItemsMosStoreSchema",
    "type": "object",
    "properties": {
        "clientId": {
            "type": "string",
            "pattern": "^[0-9]+$"
        },
        "storeId": {
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
        "startDateTime": {
            "type": "string",
            "format": "date-time"
        },
        "endDateTime": {
            "type": "string",
            "format": "date-time"
        },
        "search": {
            "type": "string"
        },
        "page": {
            "type": "string",
            "pattern": "^[0-9]+$",
        },
        "limitByPage": {
            "type": "string",
            "pattern": "^[0-9]+$",
        },
        "limit": {
            "type": "string",
            "pattern": "^[0-9]+$",
        },
        "sortBy": {
            "type": "string",
            "enum": [
                "id",
                "invoiceNumber",
                "createdAt",
                "clientName",
                "value",
                "origin",
                "storeName"
            ]
        },
        "order": {
            "type": "string",
            "enum": ["asc", "desc"]
        }
    },
    "anyOf": [
        { "required": ["clientId"] },
        { "required": ["storeId"] }
    ]
}

export default [
    {
        name: "createPaymentMosStoreSchema",
        schema: createPaymentMosStoreSchema
    },
    {
        name: "acceptPaymentMosStoreSchema",
        schema: acceptPaymentMosStoreSchema
    },
    {
        name: "rejectPaymentMosStoreSchema",
        schema: rejectPaymentMosStoreSchema
    },
    {
        name: "getAllPaymentItemsMosStoreSchema",
        schema: getAllPaymentItemsMosStoreSchema
    }
]