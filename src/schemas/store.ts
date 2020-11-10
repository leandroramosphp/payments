const createStoreSchema =
{
    "title": "createStoreSchema",
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
        name: "createStoreSchema",
        schema: createStoreSchema
    },
    {
        name: "getStoreBalanceSchema",
        schema: getStoreBalanceSchema
    }
]