const express = require('express');
const redisClient = require('../redis-client/app');
const session = require('express-session');
const redisStore = require('connect-redis')(session);
//Once your redis configuration are added set below flag to true
const redisStoreIsConfigured = false;

function setupExpress() {

    // Create a new Express application
    var app = express();

    let sessionOptions = {
        secret: 'someSecretKeyShouldButItBeStatic',
        name: 'RedisEnabled',
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: true,
            maxAge: 24 * 60 * 60 * 1000 // 24 hours milliseconds 
        }
    }

    if (redisStoreIsConfigured) {
        sessionOptions.store = new redisStore(
            {
                client: redisClient(),
                ttl: 86400, //24 hours in seconds
            })
    }

    app.use(session(sessionOptions));

    // Add a basic route – index page
    app.get('/', function (req, res) {
        res.send(JSON.stringify({
            session: req.session,
            pid: process.pid,
            sid: req.sessionID,
        }, null, 2));
    });

    // Access the session as req.session
    app.get('/session', function (req, res, next) {
        if (req.session.views) {
            req.session.views++
            res.setHeader('Content-Type', 'text/html')
            res.write('<p>views: ' + req.session.views + '</p>')

            res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
            res.end()
        } else {
            req.session.views = 1
            res.end('welcome to the session demo. refresh!')
        }
    });

    app.get('/signup', function (req, res) {

        var newUser = { id: 'test@test.com', password: 'secretPassword' };
        Users.push(newUser);
        req.session.user = newUser;
        res.send('protected_page');

    });

    // Bind to a port
    app.listen(3000);

}

module.exports = setupExpress;