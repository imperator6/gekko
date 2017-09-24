const _ = require('lodash');
const fs = require('co-fs');
const promisify = require('promisify-node');

const gekkoRoot = __dirname + '/../../';
const apiKeyManager = require('../apiKeyManager.js');

const async = require('async');


module.exports = function *() {

  var load = function(resolve, reject) {

    var exchangeNames = apiKeyManager.get();

    var setFunc = function (name, next) {

      var keys = apiKeyManager._getApiKeyPair(name);
      var config = {};

      config.key = keys.key;
      config.secret = keys.secret;

      var Exchange = require('../../exchanges/' + name);
      var exchange = new Exchange(config);

      var cb = function(err, data) {
        return next(false, {name: name, values: data });
      }.bind(this);

      if(typeof exchange.getFullPortfolio === "function") {
        exchange.getFullPortfolio(cb);
      } else {
        cb(null, {});
      }
    }

    async.map(exchangeNames, setFunc , function (err, results) {
      this.body = results;
      resolve();
    }.bind(this));

  }.bind(this);

  return yield new Promise(load);
}
