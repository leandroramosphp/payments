const createPaymentSchema =
{
    "title": "createPaymentSchema",
    "type": "object",
    "properties": {
        "storeId": {
            "type": ["integer", "string"],
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
    "required": ["storeId", "mallId", "clientId", "value", "creditCardId", "installments"]
}

const acceptPaymentSchema =
{
    "title": "acceptPaymentSchema",
    "type": "object",
    "properties": {
        "storeId": {
            "type": ["integer", "string"],
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

const rejectPaymentSchema =
{
    "title": "rejectPaymentSchema",
    "type": "object",
    "properties": {
        "storeId": {
            "type": ["integer", "string"],
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

const getAllPaymentsSchema =
{
    "title": "getAllPaymentsSchema",
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
        "mallId": {
            "type": "string",
            "pattern": "^[0-9]+$"
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
                "storeName",
                "clientName",
                "installments",
                "value",
                "status"
            ]
        },
        "order": {
            "type": "string",
            "enum": ["asc", "desc"]
        }
    },
    "required": ["mallId"],
    "anyOf": [
        { "required": ["clientId"] },
        { "required": ["storeId"] }
    ]
}

const getAllPaymentItemsSchema =
{
    "title": "getAllPaymentItemsSchema",
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
    "required": ["mallId"],
    "anyOf": [
        { "required": ["clientId"] },
        { "required": ["storeId"] }
    ]
}

export default [
    {
        name: "createPaymentSchema",
        schema: createPaymentSchema
    },
    {
        name: "acceptPaymentSchema",
        schema: acceptPaymentSchema
    },
    {
        name: "rejectPaymentSchema",
        schema: rejectPaymentSchema
    },
    {
        name: "getAllPaymentsSchema",
        schema: getAllPaymentsSchema
    },
    {
        name: "getAllPaymentItemsSchema",
        schema: getAllPaymentItemsSchema
    }
]