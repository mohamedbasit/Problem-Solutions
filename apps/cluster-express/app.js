var express = require('express');
var clusterApp = require('../cluster/app')(expressSetup);

function expressSetup() {
    // Create a new Express application
    var app = express();

    // Add a basic route – index page
    app.get('/', function (req, res) {
        res.send({ [process.pid]: 'Hello from Worker' });
    });

    // Bind to a port
    app.listen(3000);
}

clusterApp();
