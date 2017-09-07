// @link http://en.wikipedia.org/wiki/Exponential_moving_average#Exponential_moving_average

// helpers
var _ = require('lodash');
var log = require('../../core/log.js');

var EMA = require('./EMA.js');

var Indicator = function(config) {
  log.debug('New ema div indicator with config', config);

  this.settings = config;
  this.result = '';
  this.age = 0;
  this.currentTrend;

  this.ema = new EMA(config.ema);

  log.debug('New ema div indicator with config', config);
}

Indicator.prototype.update = function (candle) {

  var settings = this.settings;
  var ema = this.ema;
  ema.update(candle.close);

  var avgPrice = ema.result;
  var price = candle.close;

  var diff = (price/avgPrice*100)-100;

  var message = 'emadivindicator@ ' + price.toFixed(8) + ' ( avgPrice:' + avgPrice.toFixed(5) + ' diff:' + diff + ')';

  //log.debug(message);
  if(diff <= settings.long) {

    if(this.currentTrend !== 'up') {
      this.currentTrend = 'up';
      this.result = 'long'; // buy
    } else
      this.result = '';

  } else if(diff >= settings.short) {


    if(this.currentTrend !== 'down') {
      this.currentTrend = 'down';
      this.result = 'short'; // sell
    } else
      this.result = '';

  } else {
    this.result = '';
  }
}

/* Indicator.prototype.update = function(price) {
  // The first time we can't calculate based on previous
  // ema, because we haven't calculated any yet.
  if(this.result === false)
    this.result = price;

  this.age++;
  this.calculate(price);

  return this.result;
}
*/



module.exports = Indicator;
