// helpers
var _ = require('lodash');
var log = require('../core/log.js');

// configuration
var config = require('../core/util.js').getConfig();
var settings = config.FIXPRICE;

// let's create our own method
var method = {};

// prepare everything our method needs
method.init = function() {
  this.name = 'FIXPRICE';

  this.currentTrend;

  log.debug('New FIXPRICE', settings);
}

// what happens on every new candle?
method.update = function(candle) {
  // nothing!
}

// for debugging purposes: log the last calculated
// EMAs and diff.
method.log = function() {
  
}

method.check = function(candle) { 
  var price = candle.close;

  var message = '@ ' + price.toFixed(5) + ' (long:' + settings.long.toFixed(5) + ' short: '+ settings.short.toFixed(5) +')';

  if(price <= settings.long) {
    //log.debug('long', message);

    if(this.currentTrend !== 'up') {
      this.currentTrend = 'up';
       log.debug('long advice', message);
      this.advice('long');
    } else
      this.advice();

  } else if(price >= settings.short) {
    //log.debug('short', message);

    if(this.currentTrend !== 'down') {
      this.currentTrend = 'down';
      log.debug('short advice', message);
      this.advice('short');
    } else
      this.advice();

  } else {
    log.debug('we are currently not in a long or short advice', message);
    this.advice();
  }
}

module.exports = method;
