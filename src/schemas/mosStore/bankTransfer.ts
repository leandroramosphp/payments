const createBankTransferMosStoreSchema =
{
    "title": "createBankTransferMosStoreSchema",
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
        }
    },
    "required": ["storeId", "bankAccountId", "value"]
}

const getBankTransfersMosStoreSchema =
{
    "title": "getBankTransfersMosStoreSchema",
    "type": "object",
    "properties": {
        "storeId": {
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
    "required": ["storeId"]
}

export default [
    {
        name: "createBankTransferMosStoreSchema",
        schema: createBankTransferMosStoreSchema
    },
    {
        name: "getBankTransfersMosStoreSchema",
        schema: getBankTransfersMosStoreSchema
    }
]