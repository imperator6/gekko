const _ = require('lodash');
const fs = require('co-fs');
const promisify = require('promisify-node');

const gekkoRoot = __dirname + '/../../';
const apiKeyManager = require('../apiKeyManager.js');


module.exports = function *() {

  var load = function(resolve, reject) {

    var exchangeNames = apiKeyManager.get();

    var result = []

    _.each(exchangeNames, (name) => {

      var keys = apiKeyManager._getApiKeyPair(name);
      var config = {};

      config.key = keys.key;
      config.secret = keys.secret;

      var Exchange = require('../../exchanges/' + name);
      var exchange = new Exchange(config);

      var cb = function(err, data) {
        result.push({name: name, values: data });

        if(result.length == exchangeNames.length) {
          this.body = result;
            resolve();
        }
      }.bind(this);

      exchange.getFullPortfolio(cb);
    });

  }.bind(this);

  return yield new Promise(load);
}