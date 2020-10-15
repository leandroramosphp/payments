const createClientSchema =
{
    "title": "createClientSchema",
    "type": "object",
    "properties": {
        "x-access-token": {
            "type": "string"
        },
        "clientId": {
            "type": "string",            
            "pattern": "^[0-9]+$"
        },  
        "mallId": {
            "type": "string",
            "pattern": "^[0-9]+$"
        },          
        "firstName": {
            "type": "string"
        },
        "lastName":  {
            "type": "string"
        },
        "email": {
            "type": "string"
        },
        "phoneNumber":{
            "type": "string"
        },
        "taxpayerId": {
            "type": "string"
        },
        "birthdate": {
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
                "postalCode":{
                    "type": "string"
                },
                "countryCode":{
                    "type": "string"
                },
            },
            "required": ["line1", "line2", "neighborhood", "city", "state", "postalCode", "countryCode" ]
        },    
    },
    "required": ["x-access-token", "clientId", "mallId", "firstName", "lastName", "email", "phoneNumber", "taxpayerId", "birthdate", "address"]
}

export default [
    {
        name: "createClientSchema",
        schema: createClientSchema
    }
]