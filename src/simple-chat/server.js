let WebSocketServer = require('websocket').server;
let http = require('http');
let port = 9990;

let connectSet = {
    "Alice" : { connection: null },
    "Bob" : { connection: null }
};

console.log("***CREATING WEBSOCKET SERVER");
let ws = createWebsocketServer();
ws.on('connect', (connection)=> wsConnectHandler(connection));
ws.on('request', (req)=> wsRequestHandler(req));
ws.on('close', (connection, reason, desc)=> wsCloseHandler(connection, reason, desc));
console.log("***CREATED");

// Create ws
function createWebsocketServer() {
    let server = http.createServer().listen(port);
    return new WebSocketServer({httpServer: server, autoAcceptConnections: false});
}

// Ws handler. Connect, request, close.
function wsConnectHandler(connection) {
    console.log('Service connect', connection.protocol);
}

function wsRequestHandler(req) {
    var connection = req.accept('chat', req.origin);
    connection.on('message', (message)=> connectionMessageHandler(message, connection));
    connection.on('close', ()=> connectionCloseHandler(connection));
}

function wsCloseHandler(connection, reason, desc) {
    connection.close();
    console.log('[close]', reason, desc);
}

// Connection handler. Receive message and close connection.
function connectionMessageHandler(message, connection) {
    const data = JSON.parse(message.utf8Data);

    //初次连接
    if(connectSet[data.name].connection == null) {
        console.log('[login] ', message.utf8Data);
        connectSet[data.name].connection = connection;
        connection.userName = data.name;
        return;
    }
    
    console.log('[onmessage] ' + data.name + ' send message: ' + message.utf8Data);
    let callee = data.name == 'Alice'? 'Bob': 'Alice';
    // 必须对方在线才发送消息
    if(connectSet[callee].connection) {
        connectSet[callee].connection.sendUTF(message.utf8Data);
    }
}

function connectionCloseHandler(connection) {
    console.log((new Date()) + ' Peer ' + connection.userName + ' disconnected.');
    // 一方离线，清除连接
    connectSet[connection.userName].connection = null;
    connection.close();
}
