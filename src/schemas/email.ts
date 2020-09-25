const sendEmailSchema =
{
    "title": "sendEmail",
    "type": "object",
    "properties": {
        "clientIds": {
            "type": "array"
        },
        "mallId": {
            "type": "integer"
        },
        "emailId": {
            "type": "integer"
        },
        "content": {
            "type": "string"
        },
        "subject": {
            "type": "string"
        },
        "sourceType": {
            "type": "string"
        }
    },
    "required": ["clientIds", "mallId", "sourceType"],
    "anyOf": [
        { "required": ["emailId"] },
        { "required": ["content", "subject"] }
    ]
}

export default [
    {
        name: "sendEmailSchema",
        schema: sendEmailSchema
    }
]