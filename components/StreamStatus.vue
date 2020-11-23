<template>
  <div>{{ status }}</div>
</template>
<script>
import { BigNumber } from 'ethers'
export default {
  name: 'StreamStatus',
  props: {
    startBlock: Number,
    currentBlock: Number,
    remaining: Number
  },
  data () {
    return {}
  },
  computed: {
    status () {
      let value = 'LOADING'
      console.log('startBlock, currentBlock, remaining', this.startBlock, this.currentBlock, this.remaining)

      if (this.startBlock && this.currentBlock && this.remaining) {
        const startBlock = BigNumber.from(this.startBlock).mul(10000)
        const currentBlock = BigNumber.from(this.currentBlock).mul(10000)
        const remaining = BigNumber.from(this.remaining).mul(10000)
        const minRemaining = BigNumber.from(1) // '0.0001'

        if (startBlock.lte(currentBlock)) {
          if (remaining.lte(minRemaining)) {
            value = 'ENDED'
          } else {
            value = 'STREAMING'
          }
        } else {
          value = 'WAITING'
        }
      }
      return value
    }
  },
  mounted () {
    console.log('StreamStatus created')
  }
}
</script>

<!--<style scoped>-->

<!--</style>-->
