const createBankTransferSchema =
{
    "title": "createBankTransferSchema",
    "type": "object",
    "properties": {
        "storeId": {
            "type": ["integer", "string"],
            "pattern": "^[0-9]+$"
        },
        "bankAccountId": {
            "type": "number"
        },
        "value": {
            "type": "number"
        },
        "mallId": {
            "type": "string",
            "pattern": "^[0-9]+$"
        }
    },
    "required": ["storeId", "bankAccountId", "value", "mallId"]
}

const getBankTransfersSchema =
{
    "title": "getBankTransfersSchema",
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
            "enum": ["id", "bankName", "accountNumber", "createdAt", "value"]
        },
        "order": {
            "type": "string",
            "enum": ["asc", "desc"]
        }
    },
    "required": ["storeId", "mallId"]
}

export default [
    {
        name: "createBankTransferSchema",
        schema: createBankTransferSchema
    },
    {
        name: "getBankTransfersSchema",
        schema: getBankTransfersSchema
    }
]