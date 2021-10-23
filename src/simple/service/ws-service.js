var WebSocketServer = require('websocket').server;
var http = require('http');

// 只做ws连接，所有http请求都报404
var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(9990, function() {
    console.log((new Date()) + ' Server is listening on port 9990');
});
// 为什么ws要包一层http服务？
console.log("***CREATING WEBSOCKET SERVER");
// NOTE autoAcceptConnections 设置成true会导致request句柄不触发
var ws = new WebSocketServer({httpServer: server, autoAcceptConnections: false});
console.log("***CREATED");

ws.on('connect', function(connection) {
    console.log('Service connect', connection.protocol);
});

console.log("***CRETING REQUEST HANDLER");
ws.on('request', function(req) {
    // TODO add origin validation
    console.log('[request]', req.origin);
    var connection = req.accept('echo-protocol', req.origin);
    connection.on('message', function(message) {
        console.log('[onmessage]', message);
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
            // connection.close(1015, 'ssssssssssssssssss');
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    })

    connection.on('close', function(reason, desc) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});
console.log("***REQUEST HANDLER CREATED");

ws.on('close', function(connection, reason, desc) {
    console.log('[close]', reason, desc);
});
