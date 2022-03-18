'use strict';

module.exports = {
  host: 'localhost',
  port: 27017,
  dbName: 'mongo-express-test-db',
  // `mongodb://${m.host}:${m.port}/${m.dbName}`
  makeConnectionUrl: () => module.exports.uri + module.exports.dbName,
};
