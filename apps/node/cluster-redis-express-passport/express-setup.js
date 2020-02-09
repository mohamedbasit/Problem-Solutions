const express = require('express');
const passport = require('passport');
const redisClient = require('../redis-client/app');
const session = require('express-session');
const redisStore = require('connect-redis')(session);

function setupExpress() {

    // Create a new Express application
    var app = express();

    app.use(session({
        secret: 'ThisIsHowYouUseRedisSessionStorage',
        name: '_redisPractice',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, // Note that the cookie-parser module is no longer needed
        store: new redisStore(
            {
                client: redisClient,
                ttl: 86400,
            }),
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    // Add a basic route – index page
    app.get('/', function (req, res) {
        res.send({ [process.pid]: 'Hello from Worker' });
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

    app.post('/login', function (req, res, next) {
        console.log('came');

        if (req.isAuthenticated()) {
            return next()
        }
        res.redirect('/')
    });

    passport.serializeUser(function (user, done) {
        console.log(user);

        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        redisStore.get('userid', function (err, user) {
            console.log(user);

            done(err, user);
        });
    });

    // Bind to a port
    app.listen(3000);

}

module.exports = setupExpress;