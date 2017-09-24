<template lang='jade'>

div.contain.portfolio
  h2 Portfolio Overview
  table
    thead
    tr
      th Currency
      th Amount
      th price
      th Usd
      th Exchange
    tr(v-for='p in portfolioList')
      td {{ p.currency }}
      td {{ p.amount }}
      td {{ p.price }}
      td {{ p.usd }}
      td {{ p.name }}

</template>

<script>

import { post } from '../../tools/ajax';

export default {
  components: {

  },
  data: () => {
    return {

    }
  },
  methods: {
    openAddApi: function() {
      this.addApiToggle = true;
    }
  },
  computed: {
    portfolioList: function() {
      return this.$store.state.portfolioList
    },

    sortedPortfolioList: function() {
        function compare(a, b) {
          if (a.currency < b.currency)
            return -1;
          if (a.currency > b.currency)
            return 1;
          return 0;
        }

        return this.portfolioList.sort(compare);
      }

  },
  watch: {

  }
}
</script>

<style>

  .portfolio {
    margin-top: 50px;
    margin-bottom: 50px;
  }

  .portfolio table {
    width: 100%;
  }

  .portfolio table th,
  .portfolio table td {
    border: 1px solid #c6cbd1;
    padding: 8px 12px;
  }

  .portfolio table tr:nth-child(2n) {
    background-color: #f6f8fa;
  }

</style>
