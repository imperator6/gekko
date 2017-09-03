import Vue from 'vue'
import _ from 'lodash'

export const syncPortfolioList = (state, portfolioList) => {

  var newList = [];

  _.each(portfolioList, (p) => {
    _.each(p.values, (v) => {
      newList.push( {name: p.name, currency: v.name, amount: v.amount} );
    });
  });

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

