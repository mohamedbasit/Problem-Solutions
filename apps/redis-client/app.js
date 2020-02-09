let
    redis = require('redis'),
    client = redis.createClient({
        port: 14675,               // replace with your port
        host: 'hostname',        // replace with your hostanme or IP address
        password: 'password',    // replace with your password
    });


client.set('some-key', 'value retrieved from redis', function (err) {
    if (err) {
        throw err; /* in production, handle errors more gracefully */
    } else {
        client.get('some-key', function (err, value) {
            if (err) {
                throw err;
            } else {
                console.log(value);
            }
        }
        );
    }
});

client.on('error', (err) => {
    console.log('Redis error: ', err);
});

module.exports = client;