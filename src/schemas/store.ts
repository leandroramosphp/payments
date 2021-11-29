const getStoreBalanceSchema =
{
    "title": "getStoreBalanceSchema",
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
        name: "getStoreBalanceSchema",
        schema: getStoreBalanceSchema
    }
]