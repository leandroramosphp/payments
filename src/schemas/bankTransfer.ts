const createBankTransferSchema =
{
    "title": "createBankTransferSchema",
    "type": "object",
    "properties": {
        "storeId": {
            "type": "string",
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