const createBankTransferSchema =
{
    "title": "createBankTransferSchema",
    "type": "object",
    "properties": {
        "mallId": {
            "type": "string",
            "pattern": "^[0-9]+$"
        },
        "storeId": {
            "type": "string",
            "pattern": "^[0-9]+$"
        },
        "bankAccountId": {
            "type": "number"
        }
    },
    "required": ["mallId", "storeId", "bankAccountId"]
}

export default [
    {
        name: "createBankTransferSchema",
        schema: createBankTransferSchema
    }
]