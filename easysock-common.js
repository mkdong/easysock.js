const net = require('net');

var createSocket = (rawSocket) => {
    var socket = rawSocket;
    var events = {};

    var on = (evt, cb) => {
        events[evt] = cb;
    };
    var emit = (evt, data) => {
        console.log('emit' + evt + ' ' + data);
        socket.write(JSON.stringify({'evt': evt, 'data': data}));
    };
    var call = (evt, data) => {
        console.log(evt);
        console.log(events);
        if (events[evt])
            events[evt](data);
    };

    var c = socket;
    c.setEncoding("utf8");
    c.setNoDelay(true);
    c.setKeepAlive(true);
    var buffer = '';
    var nested = 0;
    c.on('data', (buf) => {
        console.log(''+buf);
        for (var i in buf) {
            buffer += buf[i];
            if (buf[i] == '{') nested++;
            if (buf[i] == '}') nested--;
            if (nested < 0) {
                console.log('negative nesting!');
                throw new Error('negative nesting');
            }
            if (nested == 0) {
                console.log('unwrapped nesting!');
                console.log(buffer);
                var obj = JSON.parse(buffer);
                call(obj.evt, obj.data);
                buffer = '';
            }
        }
    });
    c.on('end', () => {
        console.log('client disconnected');
        call('disconnect', {});
    });
    c.on('error', (err) => {
        console.log('conn err:', err);
    });
    return {
        conn: socket,
        on: on,
        emit: emit,
        call: call
    };
};

module.exports = {
    createSocket: createSocket,
};
