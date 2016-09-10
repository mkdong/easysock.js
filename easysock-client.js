const net = require('net');
const common = require('./easysock-common.js');

var setup = () => {
    var createClient = (host, port, cb) => {
        var onconnection = cb;
        var client = net.createConnection({host: host, port: port}, () => {
            var c = client;
            var socket = common.createSocket(c);
            //'connect' listener
            if (onconnection)
                onconnection(socket);
        }).on('error', (err) => {
            throw err;
        });
    };
    return {
        createClient: createClient
    };
};

module.exports = setup;
