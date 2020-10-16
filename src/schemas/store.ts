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
        "business_name": {
            "type": "string"
        },
        "business_phone": {
            "type": "string"
        },
        "business_email": {
            "type": "string"
        },  
        "ein": {
            "type": "string"
        },           
        "mcc":{
            "type": "string"
        },
    },  
    "required": ["x-access-token", "storeId", "mallId", "business_name", "business_phone", "business_email", "ein", "mcc"]
}
  
export default [
    {
        name: "createStoreSchema",
        schema: createStoreSchema
    }
]