# Websocket 练习代码
服务端用node进行开发。
http.js代表客户端服务器，`node http.js`即可通过9991端口访问index.html
server.js代表ws服务端，`node server.js`即可通过9990端口与之建立连接

## api-example
该样例初始验证浏览器与服务端Api。达到浏览器与服务器双向通信。

## simple-chat
是一个简易客户端之间通信的样例，内置了Alice和Bob两个角色。服务器作为受信任的信息中转方，维护两端连接，相机调用对应连接传递端点信息。