var push = require( 'pushover-notifications' );
var _ = require('lodash');
var log = require('../core/log.js');
var util = require('../core/util.js');
var dirs = util.dirs();
var config = util.getConfig();
var checker = require(dirs.core + 'exchangeChecker.js');
var pushoverConfig = config.pushover;
var request = require("request");

var Pushover = function() {
  _.bindAll(this);

  this.p;
  this.price = 'N/A';

  if(_.isObject(config.trader)) {
      var exchangeMeta = checker.settings(config.watch);
      this.exchangeSlug = exchangeMeta.slug;

      // create an exchange
      var Exchange = require(dirs.exchanges + this.exchangeSlug);
      this.exchange = new Exchange(_.extend(config.trader, config.watch));
  }

  this.setup();
}

Pushover.prototype.setup = function() {

  var setupPushover = function() {
    this.p = new push( {
        user: pushoverConfig.user,
        token: pushoverConfig.key,
    });

    if(pushoverConfig.sendPushoverOnStart) {
      this.send(
        " Gekko has started ",
        [
          "Gekko started watching",
          config.watch.exchange,
          config.watch.currency,
          '/',
          config.watch.asset,
          "Portfolio:",
          this.currencyItem.name,
          this.currencyItem.amount.toFixed(6),
          this.assetItem.name,
          this.assetItem.amount.toFixed(6)
        ].join(' ')
      );

      // this.processAdvice({recommendation: 'short'});
    } else
    log.debug('Setup pushover adviser.');
  }

  var setPortfolio = function(err, fullPortfolio) {
    if(err)
      util.die(err);
      
      this.currencyItem = _.find(fullPortfolio, (p) => { return p.name === config.watch.currency});

      if(!this.currencyItem) {
          this.currencyItem = {name: config.watch.currency, amount: 0};
      }

      this.assetItem = _.find(fullPortfolio, (p) => { return p.name === config.watch.asset});

      if(!this.assetItem) {
          this.assetItem = {name: config.watch.asset, amount: 0};
      }

    setupPushover.call(this);

  }.bind(this);

  if(_.isObject(this.exchange)) {
    util.retry(this.exchange.getPortfolio, setPortfolio);
  } else {
    setPortfolio(null, []);
  }
}

Pushover.prototype.send = function(subject, content) {
  var msg = {
      // These values correspond to the parameters detailed on https://pushover.net/api
      // 'message' is required. All other values are optional.
      message: content,
      title: pushoverConfig.tag + subject,
      device: 'devicename',
      priority: 1,
      url: this.getUrl(),
      sound: 'cashregister'
  };

  this.p.send( msg, function( err, result ) {
      if ( err ) {
          throw err;
      }

      console.log( result );
  });

}

Pushover.prototype.processCandle = function(candle, callback) {
  this.price = candle.close;
  callback();
}

Pushover.prototype.processAdvice = function(advice) {
  if (advice.recommendation == 'soft' && pushoverConfig.muteSoft) return;

  this.getUsdPrice(this.price, config.watch.currency, (usdPrice) => {

    var text = [
      advice.recommendation,
      this.price,
      config.watch.currency
    ].join(' ');

    if(usdPrice > -1) {
      text += ' (' + usdPrice + ' USD' + ')';
    } 
   
   var subject = text;
   this.send(subject, text);
  });
}

Pushover.prototype.checkResults = function(err) {
  if(err)
    log.warn('error sending pushover', err);
  else
    log.info('Send advice via pushover.');
}

Pushover.prototype.getUsdPrice = function(price, currency, callback) {

  if('ETH' === currency || 'BTC' === currency) {
        var url = ['https://api.coinbase.com/v2/exchange-rates?currency=', currency].join('');
        request({
          url: url,
          json: true
        }, function (error, response, body) {
          if (!error && response.statusCode === 200) {     
              var rate = body.data.rates['USD'];
              var usdPrice = price * rate;
              callback(usdPrice.toFixed(3));
          } else {
            callback(-1);
          }
      });
  } else  {
      callback(-1);
  }
}

Pushover.prototype.getUrl = function() {
  var url = pushoverConfig.url;
  
  if(url !== undefined) {
      url = url.replace('$currency', config.watch.currency);
      url = url.replace('$asset', config.watch.asset);
  }

 return url
}




module.exports = Pushover;
