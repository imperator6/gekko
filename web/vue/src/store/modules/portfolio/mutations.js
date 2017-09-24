import Vue from 'vue'
import _ from 'lodash'

export const syncPortfolioList = (state, portfolioList) => {

  var newList = [];

  var total = 0;

  _.each(portfolioList, (p) => {
    _.each(p.values, (v) => {
      if(v.amount > 0.001) {
        var usd = _.isNumber(v.USD) ? v.USD : 0;
        var price = _.isNumber(v.price) ? v.price : 0;
        
        newList.push( {name: p.name, currency: v.name, amount: v.amount , usd: _.round(usd, 2), price: _.round(price, 2)} );
        if(_.isNumber(v.USD)) {
          total += v.USD;
        }
      }
    });
  });

  total = _.round(total, 2);

  newList.push( {name: 'all', currency: 'x_TOTAL_USD', amount: 1 , usd: total} );

  function compare(a, b) {
    if (a.currency < b.currency)
      return -1;
    if (a.currency > b.currency)
      return 1;
    return 0;
  }



  Vue.set(state, 'portfolioList', newList.sort(compare));
  return state;
}

