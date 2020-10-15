const createStoreSchema =
{
    "title": "createStoreSchema",
    "type": "object",
    "properties": {
        "x-access-token": {
            "type": "string"
        },
        "storeId": {
            "type": "string",            
            "pattern": "^[0-9]+$"
        },  
        "mallId": {
            "type": "string",
            "pattern": "^[0-9]+$"
        },                  
        "owner":{
            "type": "object",
            "properties": {
                "firstName":{
                    "type": "string"
                },
                "lastName":{
                    "type": "string"
                },
                "email":{
                    "type": "string"
                },
                "phoneNumber":{
                    "type": "string"
                },
                "taxPayerId":{
                    "type": "string"
                },
                "birthdate":{
                    "type": "string"
                },            
            },
            "required": ["firstName", "lastName", "email", "phoneNumber", "taxPayerId", "birthdate"]
        },
        "businessName": {
            "type": "string"
        },
        "businessPhone": {
            "type": "string"
        },
        "businessEmail": {
            "type": "string"
        },  
        "ein": {
            "type": "string"
        },    
        "businessAddress":{
            "type": "object",
            "properties": {
                "line1":{
                    "type": "string"
                },
                "line2":{
                    "type": "string"
                },
                "line3":{
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
            "required": ["line1", "line2", "line3", "neighborhood", "city", "state", "postalCode", "countryCode" ]
        },
        "owner_address":{
            "type": "object",
            "properties": {
                "line1":{
                    "type": "string"
                },
                "line2":{
                    "type": "string"
                },
                "line3":{
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
            "required": ["line1", "line2", "line3", "neighborhood", "city", "state", "postalCode", "countryCode" ]
        },
        "mcc":{
            "type": "string"
        },
    },
    "required": ["x-access-token", "storeId", "mallId", "owner", "businessName", "businessPhone", "businessEmail", "ein", "businessAddress", "ownerAddress", "mcc"]
}
  
export default [
    {
        name: "createStoreSchema",
        schema: createStoreSchema
    }
]