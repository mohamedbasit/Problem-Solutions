const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const user = {
    username: 'test-user',
    passwordHash: 'bcrypt-hashed-password',
    id: 1
}

passport.use(new LocalStrategy(
    (username, password, done) => {
        console.log('auth', findUser);

        findUser(username, (err, user) => {
            if (err) {
                return done(err)
            }

            // User not found
            if (!user) {
                return done(null, false)
            }

            return done(null, user);
        })
    }
))