<template lang='jade'>
  .contain.trades
    h2 Trades
    table(v-if='trades.length')
      thead
        tr
          th Date
          th Action
          th Price
          th Asset
          th Currency
          th Balance
        tr(v-for='rt in trades')
          td {{ fmt(rt.date) }}
          td {{ rt.action }}
          td {{ round(rt.price) }}
          td {{ rt.portfolio.asset }}
          td {{ rt.portfolio.currency }}
          td {{ rt.portfolio.balance }}
    div(v-if='!trades.length')
      p No trades to display
</template>

<script>
export default {
  props: ['trades'],
  data: () => {
    return {}
  },
  methods: {
    diff: n => moment.duration(n).humanize(),
    humanizeDuration: (n) => window.humanizeDuration(n),
    fmt: mom => moment.utc(mom).format('YYYY-MM-DD HH:mm'),
    round: n => (+n).toFixed(3),
  },
}
</script>

<style>

.trades {
  margin-top: 50px;
  margin-bottom: 50px;
}

.trades table {
  width: 100%;
}

.trades table th,
.trades table td {
  border: 1px solid #c6cbd1;
  padding: 8px 12px;
}

.trades table tr:nth-child(2n) {
  background-color: #f6f8fa;
}

</style>
