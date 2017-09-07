import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'

import * as importMutations from './modules/imports/mutations'
import * as watchMutations from './modules/watchers/mutations'
import * as stratrunnerMutations from './modules/stratrunners/mutations'
import * as notificationMutations from './modules/notifications/mutations'
import * as configMutations from './modules/config/mutations'
import * as portfolioMutations from './modules/portfolio/mutations'

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production'

let mutations = {};

_.merge(mutations, importMutations);
_.merge(mutations, watchMutations);
_.merge(mutations, stratrunnerMutations);
_.merge(mutations, notificationMutations);
_.merge(mutations, configMutations);
_.merge(mutations, portfolioMutations);

export default new Vuex.Store({
  state: {
    warnings: {
      connected: true, // assume we will connect
    },
    imports: [],
    stratrunners: [],
    watchers: [],
    connection: {
      disconnected: false,
      reconnected: false
    },
    apiKeys: [],
    exchanges: {},
    portfolioList: []
  },
  mutations,
  strict: debug
})