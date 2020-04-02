const express = require('express');
const passport = require('passport');
const createLocalStrategy = require('./strategy');
const redisClient = require('../redis-client/app');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser')

//Once your redis configuration are added set below flag to true
const redisStoreIsConfigured = false;


function setupExpress() {

    // Create a new Express application
    var app = express();

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }))

    // parse application/json
    app.use(bodyParser.json())

    app.use(express.static('views'));


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
        const redisStore = require('connect-redis')(session);
        //If you set this option then express session going to add session details
        //in redis store otherwise by default store it in "memorystore" means "InMemory"
        sessionOptions.store = new redisStore(
            {
                client: redisClient(),
                ttl: 86400, //24 hours in seconds
            })
    } else {
        app.use(session({
            secret: 'secret',
            resave: false,
            saveUninitialized: false
        }));
    }

    app.use(session(sessionOptions));

    //Passport configuration
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (id, done) {
        done(null, id);
    });

    passport.use(createLocalStrategy());

    // Add a basic route – index page
    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, './views', 'signUp.html'));
    });

    app.post('/login',
        passport.authenticate('local', { failureRedirect: '/errorWhileLogin' }),
        function (req, res) {
            res.redirect('/session');
        });

    app.get('/logout',
        function (req, res) {
            req.logout();
            res.redirect('/');
        });

    // Just to check whether we have access to the req.session
    app.get('/session', function (req, res, next) {
        res.write('welcome to the session demo. refresh! ');
        res.end(JSON.stringify({
            session: req.session,
            pid: process.pid,
            sid: req.sessionID,
            user: req.user || ""
        }, null, 2));
    });

    // Bind to a port
    app.listen(3000, () => {
        console.log('listening 3000');
    });

}

module.exports = setupExpress;