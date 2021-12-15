const createBankAccountMosStoreSchema =
{
    "title": "createBankAccountMosStoreSchema",
    "type": "object",
    "properties": {
        "bankAccountToken": {
            "type": "string"
        },
        "storeId": {
            "type": ["integer", "string"],
        },
    },
    "required": ["bankAccountToken", "storeId"]
}

const disableBankAccountMosStoreSchema =
{
    "title": "disableBankAccountMosStoreSchema",
    "type": "object",
    "properties": {
        "id": {
            "type": "string",
            "pattern": "^[0-9]+$"
        },
        "storeId": {
            "type": ["integer", "string"],
            "pattern": "^[0-9]+$"
        },
    },
    "required": ["id", "storeId"]
}

const getBankAccountsMosStoreSchema =
{
    "title": "getBankAccountsMosStoreSchema",
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
        name: "createBankAccountMosStoreSchema",
        schema: createBankAccountMosStoreSchema
    },
    {
        name: "disableBankAccountMosStoreSchema",
        schema: disableBankAccountMosStoreSchema
    },
    {
        name: "getBankAccountsMosStoreSchema",
        schema: getBankAccountsMosStoreSchema
    }
]