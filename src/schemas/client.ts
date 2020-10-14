const createClientSchema =
{
    "title": "createClientSchema",
    "type": "object",
    "properties": {
        "marketPlaceId": {
            "type": "string"
        },  
        "username":{
            "type": "string"
        },
        "password":{
            "type": "string"
        },
        "first_name": {
            "type": "string"
        },
        "last_name":  {
            "type": "string"
        },
        "taxpayer_id": {
            "type": "string"
        },
        "email": {
            "type": "string"
        },
        "address":{
            "type": "object",
            "properties": {
                "line1":{
                    "type": "string"
                },
                "line2":{
                    "type": "string"
                },
                "neighborhood":{
                    "type": "string"
                },
                "city":{
                    "type": "string"
                },
                "state":{
                    "type": "string"
                },
                "postal_code":{
                    "type": "string"
                },
                "country_code":{
                    "type": "string"
                },
            },
            "required": ["line1", "line2", "neighborhood", "city", "state", "postal_code", "country_code" ]
        },
        "metadata":{
            "type": "object",
            "properties": {
                "twitter.id": {
                    "type": "string"
                },
                "facebook.user_id": {
                    "type": "string"
                },
                "my-own-customer-id": {
                    "type": "string"
                },
            },
            "required": []
          }
    },
    "required": ["first_name","last_name","taxpayer_id", "email", "address"]
}

export default [
    {
        name: "createClientSchema",
        schema: createClientSchema
    }
]