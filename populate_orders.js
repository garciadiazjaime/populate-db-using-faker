var pg = require('pg');
var conString = process.env.DATABASE_URL;
var client = new pg.Client(conString);

var faker = require('faker');
var jsf = require('json-schema-faker');

var maxID = 11;
var maxOrders = 10;
var schemaOrder = require('./schema/schemaOrder');
var schemaOrderDetail = require('./schema/schemaOrderDetail');


/************** FORMATS BEGIN **************/

jsf.formats('getSource', function(gen, schema) {
    var options = ['call center', 'online', 'dine in'],
        index = Math.floor(Math.random() * options.length);
    return options[index];
});

jsf.formats('getDate', function(gen, schema) {
    var d = new Date();
    d.setHours(d.getHours() + 5);

    var date = d.toJSON(),
        time = d.toLocaleTimeString(),
        bits = date.split('T'),
        response = bits[0] + ' ' + time;
    return response;
});

jsf.formats('getOrderID', function(gen, schema) {
    return maxID;
});

jsf.formats('getType', function(gen, schema) {
    var options = ['pizza', 'other', 'drink'],
        index = Math.floor(Math.random() * options.length);
    return options[index];
});

/************** FORMATS END **************/


pg.connect(conString, function(err, client, done) {
    if (err) {
        return console.error('could not connect to postgres', err);
    }

    client.query('select max(id) from external_orders;', function(err, result) {
        done();

        if (err) {
            return console.error('error running query', err);
        }
        maxID = result.rows[0].max;

        for (var i = 1; i <= maxOrders; i++) {
            maxID++;
            var sample = jsf(schemaOrder),
                values = [maxID];

            for (var key in sample) {
                values.push(sample[key]);
            }

            // save details
            (function(maxID) {
                client.query('INSERT INTO external_orders(id, order_number, store_id, customer_id, status, address, zone,  source, comments, total, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
                    values,
                    function(err, result) {
                        if (err) {
                            console.log(values);
                            return console.error('error running query', err);
                        }
                        console.log('external_orders', maxID, result.command, result.rowCount);

                        var numDetails = Math.floor((Math.random() * 6) + 1);

                        for (var j = 0; j < numDetails; j++) {

                            var sampleDetail = jsf(schemaOrderDetail),
                                order_value = [maxID];

                            for (var key in sampleDetail) {
                                order_value.push(sampleDetail[key]);
                            }

                            client.query('INSERT INTO external_orders_detail(order_id, quantity, name, description, type) VALUES ($1, $2, $3, $4, $5)',
                                order_value,
                                function(err, result) {
                                    if (err) {
                                        console.log(order_value);
                                        return console.error('error running query', err);
                                    }
                                    done();
                                    console.log('external_orders_detail', maxID, result.command, result.rowCount);
                                });
                        }
                    });
            }(maxID));
        }
    });
});
