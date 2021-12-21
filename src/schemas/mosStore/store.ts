const getStoreBalanceMosStoreSchema =
{
    "title": "getStoreBalanceMosStoreSchema",
    "type": "object",
    "properties": {
        "storeId": {
            "type": ["integer", "string"],
            "pattern": "^[0-9]+$"
        },
    },
    "required": ["storeId"]
}

const generateQrcodeMosStoreSchema =
{
    "title": "generateQrcodeMosStoreSchema",
    "type": "object",
    "properties": {
        "storeId": {
            "type": "string",
        },
    },
    "required": ["storeId"]
}

export default [
    {
        name: "getStoreBalanceMosStoreSchema",
        schema: getStoreBalanceMosStoreSchema
    },
    {
        name: "generateQrcodeMosStoreSchema",
        schema: generateQrcodeMosStoreSchema
    }
]