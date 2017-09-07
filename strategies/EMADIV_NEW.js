// helpers
var _ = require('lodash');
var log = require('../core/log.js');

// configuration
var config = require('../core/util.js').getConfig();
var settings = config.EMADIV_NEW;

// let's create our own method
var method = {};

// prepare everything our method needs
method.init = function() {
  log.debug('NEW EMADIV_NEW', settings);
  this.name = 'EMADIV_NEW';

  this.currentTrend;
  this.requiredHistory = config.tradingAdvisor.historySize;

  // define the indicators we need
  this.addIndicator('emadiv', 'EMADIV', settings.emadiv);
}

// what happens on every new candle?
method.update = function(candle) {
  // nothing!
}

// for debugging purposes: log the last calculated
// EMAs and diff.
method.log = function() {
  var ema = this.indicators.emadiv.ema;
  //log.debug('calculated EMA properties for candle:');
  //log.debug('\t', 'ema:', ema.result.toFixed(8));
  //log.debug('\t DEMA age:', ema.age, 'candles');
}

method.check = function(candle) {
  var ema = this.indicators.emadiv;

  var emadivResult = this.indicators.emadiv.result;

  // raise detection for short
  if(this.lastAction === 'long') {
     var diffToCurrent = (candle.close / this.longPrice*100)-100;
      if(diffToCurrent <= settings.stop.short) { // 10% down trend
        log.debug('raise detection for short current close:',  candle.close, 'shortPrice was:', this.shortPrice, 'diff', diffToCurrent, candle.start.format('YYYY-MM-DD HH:mm:ss'));
        this.lastAction = 'short';
        this.waitForEmaDivShort = true;
        this.advice('short');
        return;
      }
  }

  if(this.waitForEmaDivShort && emadivResult !== 'short') {
    this.advice();
    return;
  } else {
    this.waitForEmaDivShort = false;
  }

  // raise detection for long
  if(this.lastAction === 'short') {
    var diffToCurrent = (candle.close / this.longPrice*100)-100;
    if(diffToCurrent >= settings.stop.long) { // 10% up trend
      log.debug('raise detection for long current close:',  candle.close, 'longPrice was:', this.longPrice, 'diff', diffToCurrent, candle.start.format('YYYY-MM-DD HH:mm:ss'));
      this.lastAction = 'long';
      this.waitForEmaDivLong = true;
      this.advice('long');
      return;
    }
  }

  if(this.waitForEmaDivLong && emadivResult !== 'long') {
    this.advice();
    return;
  } else {
    this.waitForEmaDivLong = false;
  }

  var finalAdvice = emadivResult;
  if(finalAdvice === 'short') {
    this.shortPrice = candle.close;
    this.lastAction = finalAdvice;
  } else if (finalAdvice === 'long') {
    this.longPrice = candle.close;
    this.lastAction = finalAdvice;
  }

  this.advice(finalAdvice);

}

module.exports = method;
