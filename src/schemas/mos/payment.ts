const createPaymentMosSchema =
{
    "title": "createPaymentMosSchema",
    "type": "object",
  "properties": {
      
        "storeId": {
            "type": ["integer", "string"],
        },
        "clientId": {
            "type": "number"
        },
        "value": {
            "type": "number"
        },
        "installments": {
            "type": "number"
        },
        "creditCardId": {
            "type": "number"
        }
    },
    "required": ["storeId","clientId", "value", "creditCardId", "installments"]
}

export default [
    {
        name: "createPaymentMosSchema",
        schema: createPaymentMosSchema
    },
  
]