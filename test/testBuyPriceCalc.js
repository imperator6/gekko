console.log(`Test Biitrex`);

var _ = require('lodash');
var util = require(__dirname + '/../core/util.js');
var config = util.getConfig();

var DataProvider = require(__dirname + '/../exchanges/bittrex.js');

var watcher = new DataProvider(config.watch);

watcher.getPortfolio(function(err, result) {
    console.log('Portfolio: ');
    console.log(result);

    var amount = _.find(result, function(i) { return i.name === 'USDT'}).amount

    console.log('Amount Before');
     console.log(amount);

     watcher.getTicker(function(err, ticker) {
         
            amount = amount / ticker.ask;
            console.log('Amount after');
            console.log(amount);

            var price = ticker.bid;
            price *= 1e8;
            price = Math.floor(price);
            price /= 1e8;

            console.log('price');
            console.log(price);

            var balanceNeeded = price * amount
            console.log(balanceNeeded)

        
     });

    //var amount = r
});

/*
watcher.getTicker(function(err, result) {
    console.log('Ticker: ');
    console.log(result);
});

var amount = this.getBalance(this.currency) / this.ticker.ask;


var price = this.ticker.bid;
price *= 1e8;
price = Math.floor(price);
price /= 1e8;

console.log(price);

*/