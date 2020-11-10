const createTransactionSchema =
{
    "title": "createTransactionSchema",
    "type": "object",
    "properties": {
    },
    "required": []
}

const acceptTransactionSchema =
{
    "title": "acceptTransactionSchema",
    "type": "object",
    "properties": {
    },
    "required": []
}

const rejectTransactionSchema =
{
    "title": "rejectTransactionSchema",
    "type": "object",
    "properties": {
    },
    "required": []
}

const getAllTransactionsSchema =
{
    "title": "getAllTransactionsSchema",
    "type": "object",
    "properties": {
    },
    "required": []
}

export default [
    {
        name: "createTransactionSchema",
        schema: createTransactionSchema
    },
    {
        name: "acceptTransactionSchema",
        schema: acceptTransactionSchema
    },
    {
        name: "rejectTransactionSchema",
        schema: rejectTransactionSchema
    },
    {
        name: "getAllTransactionsSchema",
        schema: getAllTransactionsSchema
    }
]