<template lang='jade'>
  div
    .hr.contain
    div.contain
      h3 Backtest result
    result-summary(:report='result.report')
    .hr.contain
    chart(:data='result', height='500')
    .hr.contain
    tradesTable(:trades='result.trades')
    .hr.contain
    roundtripTable(:roundtrips='result.roundtrips')
</template>

<script>
import resultSummary from './summary.vue'
import chart from './chartWrapper.vue'
import roundtripTable from './roundtripTable.vue'
import tradesTable from './tradesTable.vue'

export default {
  props: ['result'],
  data: () => {
    return {}
  },
  methods: {},
  components: {
    roundtripTable,
    tradesTable,
    resultSummary,
    chart
  }
}
</script>

<style>
</style>
