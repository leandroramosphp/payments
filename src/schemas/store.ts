const getStoreBalanceSchema =
{
    "title": "getStoreBalanceSchema",
    "type": "object",
    "properties": {
        "storeId": {
            "type": ["integer", "string"],
            "pattern": "^[0-9]+$"
        },
        "mallId": {
            "type": "string",
            "pattern": "^[0-9]+$"
        }
    },
    "required": ["storeId", "mallId"]
}

const generateQrcodeSchema =
{
    "title": "generateQrcodeSchema",
    "type": "object",
    "properties": {
        "storeId": {
            "type": "integer",
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
    },
    {
        name: "generateQrcodeSchema",
        schema: generateQrcodeSchema
    }
]