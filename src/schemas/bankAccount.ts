const createBankAccountSchema =
{
    "title": "createBankAccountSchema",
    "type": "object",
    "properties": {
        "bankAccountToken": {
            "type": "string"
        },
        "storeId": {
            "type": ["integer", "string"],
            "pattern": "^[0-9]+$"
        },
        "mallId": {
            "type": "string",
            "pattern": "^[0-9]+$"
        }
    },
    "required": ["bankAccountToken", "storeId", "mallId"]
}

const disableBankAccountSchema =
{
    "title": "disableBankAccountSchema",
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
        "mallId": {
            "type": "string",
            "pattern": "^[0-9]+$"
        }
    },
    "required": ["id", "storeId", "mallId"]
}

const getBankAccountsSchema =
{
    "title": "getBankAccountsSchema",
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

export default [
    {
        name: "createBankAccountSchema",
        schema: createBankAccountSchema
    },
    {
        name: "disableBankAccountSchema",
        schema: disableBankAccountSchema
    },
    {
        name: "getBankAccountsSchema",
        schema: getBankAccountsSchema
    }
]