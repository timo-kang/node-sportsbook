var assert = require('assert');
var config = require('../configs/config');
var mysql = require('mysql');

function connect() {
    return mysql.createConnection({
        host: config.DB.HOST,
        user: config.DB.USER,
        password: config.DB.PASS,
        database: config.DB.DATABASE
    });
}

function query(query, params, callback) {
    //third parameter is optional
    assert(query);
    if (typeof params == 'function') {
        callback = params;
        params = [];
    }
    doIt();
    function doIt() {
        var client = connect();
        client.query(query, params, function(err, result) {
            if (err) {
                if (err.code === '') {
                    console.error('[INTERNAL] Warning: Retrying deadlocked transaction: ', query, params);
                    return doIt();
                }
                else return callback(err);
            }

            callback(null, result);
        });
    }
}

exports.query = query;
