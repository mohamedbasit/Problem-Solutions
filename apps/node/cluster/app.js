const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

module.exports = function (execFunction) {
    return function () {

        if (cluster.isMaster) {
            console.log(`Master ${process.pid} is running`);

            // Fork workers.
            for (let i = 0; i < numCPUs; i++) {
                cluster.fork();
            }

            cluster.on('exit', (worker, code, signal) => {
                console.log(`worker ${worker.process.pid} died`);
            });

        } else {

            if (typeof execFunction == 'function') {
                execFunction();
            }


            console.log(`Worker ${process.pid} started`);
        }
    }

}