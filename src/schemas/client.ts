const createClientSchema =
{
    "title": "createClientSchema",
    "type": "object",
    "properties": {
        "clientId": {
            "type": "string",
            "pattern": "^[0-9]+$"
        },
        "mallId": {
            "type": "string",
            "pattern": "^[0-9]+$"
        }
    },
    "required": ["clientId", "mallId"]
}

export default [
    {
        name: "createClientSchema",
        schema: createClientSchema
    }
]