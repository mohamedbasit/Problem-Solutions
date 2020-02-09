const http = require('http');

function mockServer() {
    // Workers can share any TCP connection
    // In this case it is an HTTP server
    http.createServer((req, res) => {
        res.writeHead(200);
        res.end('hello world\n');
    }).listen(8000);
}


let clusterApp = require('./app')(mockServer);
clusterApp();


