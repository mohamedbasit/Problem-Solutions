const setupExpress = require('./express-setup-with-redis');
const clusterApp = require('../cluster/app')(setupExpress);

clusterApp();