const createBankAccountSchema =
{
    "title": "createBankAccountSchema",
    "type": "object",
    "properties": {
        "bankAccountToken": {
            "type": "string"
        },
        "mallId": {
            "type": "string",
            "pattern": "^[0-9]+$"
        },
        "storeId": {
            "type": "string",
            "pattern": "^[0-9]+$"
        }
    },
    "required": ["bankAccountToken", "mallId", "storeId"]
}

const disableBankAccountSchema =
{
    "title": "disableBankAccountSchema",
    "type": "object",
    "properties": {
        "mallId": {
            "type": "string",
            "pattern": "^[0-9]+$"
        },
        "id": {
            "type": "string",
            "pattern": "^[0-9]+$"
        },
        "storeId": {
            "type": "string",
            "pattern": "^[0-9]+$"
        }
    },
    "required": ["id", "mallId", "storeId"]
}

const getAllBankAccountsSchema =
{
    "title": "getAllBankAccountsSchema",
    "type": "object",
    "properties": {
        "mallId": {
            "type": "string",
            "pattern": "^[0-9]+$"
        },
        "storeId": {
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
        name: "getAllBankAccountsSchema",
        schema: getAllBankAccountsSchema
    }
]