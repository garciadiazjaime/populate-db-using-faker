var schemaOrderDetail = {
    type: 'object',
    properties: {
        quantity: {
            type: 'integer',
            minimum: 1,
            maximum: 6
        },
        name: {
            type: 'string',
            faker: 'name.firstName'
        },
        description: {
            type: 'string'
        },
        type: {
            type: 'string',
            format: 'getType'
        }
    },
    required: ['quantity', 'name', 'description', 'type']
};

module.exports = schemaOrderDetail;
