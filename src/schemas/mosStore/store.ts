const getStoreBalanceMosStoreSchema =
{
    "title": "getStoreBalanceMosStoreSchema",
    "type": "object",
    "properties": {
        "storeId": {
            "type": "string",
            "pattern": "^[0-9]+$"
        },
    },
    "required": ["storeId"]
}

const getStoreMarketplaceMosStoreSchema =
{
    "title": "getStoreMarketplaceMosStoreSchema",
    "type": "object",
    "properties": {
        "storeId": {
            "type": "string",
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
            "pattern": "^[0-9]+$"
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
        name: "getStoreMarketplaceMosStoreSchema",
        schema: getStoreMarketplaceMosStoreSchema
    },
    {
        name: "generateQrcodeMosStoreSchema",
        schema: generateQrcodeMosStoreSchema
    }
]