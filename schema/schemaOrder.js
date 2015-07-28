var schemaOrder = {
    type: 'object',
    properties: {
        order_number: {
            type: 'integer',
            minimum: 1000,
            maximum: 999999
        },
        store_id: {
            type: 'string',
            pattern: '2'
        },
        customer_id: {
            type: 'integer',
            minimum: 2,
            maximum: 6
        },
        status: {
            type: 'string',
            pattern: 'AWAITING_DISPATCH'
        },
        address: {
            type: 'string',
            faker: 'address.streetAddress'
        },
        zone: {
            type: 'integer',
            minimum: 1,
            maximum: 20
        },
        source: {
            type: 'string',
            format: 'getSource'
        },
        comments: {
            type: 'string'
        },
        total: {
            type: 'integer',
            minimum: 10,
            maximum: 9999
        },
        created_at: {
            type: 'string',
            format: 'getDate'
        },
        updated_at: {
            type: 'string',
            format: 'getDate'
        }
    },
    required: ['order_number', 'store_id', 'customer_id', 'status', 'address', 'zone', 'source', 'comments', 'total', 'created_at', 'updated_at']
};


module.exports = schemaOrder;
