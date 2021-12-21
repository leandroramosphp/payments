const createPaymentMosSchema =
{
    "title": "createPaymentMosSchema",
    "type": "object",
  "properties": {
      
        "storeId": {
            "type": ["integer", "string"],
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
    "required": ["storeId","clientId", "value", "creditCardId", "installments"]
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