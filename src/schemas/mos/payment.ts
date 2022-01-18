const createPaymentMosSchema =
{
    "title": "createPaymentMosSchema",
    "type": "object",
    "properties": {
        "storeId": {
            "type": "integer",
        },
        "storeCode": {
            "type": "string",
        },
        "clientId": {
            "type": "number"
        },
        "mallId": {
            "type": "string",
            "pattern": "^[0-9]+$"
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
    "required": ["clientId", "value", "creditCardId", "installments"],
    "anyOf": [
        { "required": ["storeId"] },
        { "required": ["storeCode"] }
    ]
}

const getAllPaymentsMosSchema =
{
    "title": "getAllPaymentsMosSchema",
    "type": "object",
    "properties": {
        "clientId": {
            "type": "string",
            "pattern": "^[0-9]+$"
        },
        "mallId": {
            "type": "string",
            "pattern": "^[0-9]+$"
        },
        "storeId": {
            "type": "string",
            "pattern": "^[0-9]+$"
        },
        "storeCode": {
            "type": "string",
        },
        "status": {
            "type": "string"
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
        {
            "anyOf": [
                { "required": ["storeId"] },
                { "required": ["storeCode"] },
            ]
        }
    ]
}

export default [
    {
        name: "createPaymentMosSchema",
        schema: createPaymentMosSchema
    },
    {
        name: "getAllPaymentsMosSchema",
        schema: getAllPaymentsMosSchema
    },

]