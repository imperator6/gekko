// helpers
var _ = require('lodash');
var log = require('../core/log.js');

// configuration
var config = require('../core/util.js').getConfig();
var settings = config.EMA_OR_PRICE_DIV;

// let's create our own method
var method = {};

// prepare everything our method needs
method.init = function() {
  this.name = 'EMA_OR_PRICE_DIV';

  this.currentTrend;
  this.requiredHistory = config.tradingAdvisor.historySize;

  this.longPrice = -1;
  this.shortPrice = -1;

  // define the indicators we need
  this.addIndicator('ema', 'EMA', settings.ema);
}

// what happens on every new candle?
method.update = function(candle) {
  // nothing!
}

// for debugging purposes: log the last calculated
// EMAs and diff.
method.log = function() {
  var ema = this.indicators.ema;
  log.debug('calculated EMA properties for candle:');
  log.debug('\t', 'ema:', ema.result.toFixed(8));
  log.debug('\t EMA age:', ema.age, 'candles');
}

method.check = function(candle) {
  var ema = this.indicators.ema;
  var avgPrice = ema.result;
  var price = candle.close;

  // 1. check the current price for quick money
  if(this.currentTrend === 'up' && this.longPrice > -1) {

    var longDiff = (price/this.longPrice*100)-100;

    if(longDiff >= (settings.short + Math.abs(settings.long))) {
        var message = '@ ' + price.toFixed(8) + ' ( longPrice:' + this.longPrice.toFixed(5) + ' diff:' + longDiff + ')';
        log.debug('QuickMoney: going short! ', message);
        this.currentTrend = 'down';
        this.shortPrice = price;
        this.advice('short');
        return;
    }

  } else if(this.currentTrend === 'down' && this.shortPrice > -1) {

      var shortDiff = (price/this.shortPrice*100)-100;

      if(shortDiff <= (settings.long - settings.short)) {
          var message = '@ ' + price.toFixed(8) + ' ( shortPrice:' + this.shortPrice.toFixed(5) + ' diff:' + shortDiff + ')';
          log.debug('QuickMoney: going long! ', message);
          this.currentTrend = 'up';
          this.longPrice = price;
          this.advice('long');
          return;
      }
  }


  // 2. check long ema diff against the current price
    var diff = (price/avgPrice*100)-100;

    var message = '@ ' + price.toFixed(8) + ' ( avgPrice:' + avgPrice.toFixed(5) + ' diff:' + diff + ')';

  if(diff <= settings.long) {


    if(this.currentTrend !== 'up') {
      log.debug('New Advice LONG!', message);
      this.currentTrend = 'up';
      this.longPrice = price;
      this.advice('long');
    } else {
      //log.debug('we are currently in uptrend', message);
      this.advice();
    }


  } else if(diff >= settings.short) {

    if(this.currentTrend !== 'down') {
      log.debug('New Advice SHORT!', message);
      this.currentTrend = 'down';
      this.shortPrice = price;
      this.advice('short');
    } else {
      //log.debug('we are currently in a downtrend', message);
      this.advice();
    }

  } else {
    //log.debug('we are currently not in an up or down trend', message);
    this.advice();
  }
}

module.exports = method;
