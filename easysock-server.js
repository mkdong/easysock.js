const net = require('net');
const common = require('./easysock-common.js');

var setup = () => {
    var onconnection = null;
    var server = net.createServer((c) => {
        // 'connection' listener
        var socket = common.createSocket(c);
        if (onconnection)
            onconnection(socket);
    }).on('error', (err) => {
        console.log("ignoring exception: " + err);
    });
    var sockets = {};

    var listen = (port, cb) => {
        onconnection = cb;
        server.listen(port, () => {
            console.log('server is listening to ', server.address());
        });
    };
    return {
        listen: listen
    };
};

module.exports = setup;
