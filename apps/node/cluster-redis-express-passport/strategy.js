var LocalStrategy = require('passport-local').Strategy;

function createLocalStrategy() {
    return new LocalStrategy({
        passReqToCallback: true,
    },
        function (request, username, password, done) {
            var newUser = { id: username, password: password };
            return done(null, newUser);
        }
    );
}

module.exports = createLocalStrategy;