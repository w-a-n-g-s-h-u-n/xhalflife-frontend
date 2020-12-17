<template>
  <div class='section'><div :class="['status', status]"></div>{{ status.toUpperCase() }}</div>
</template>
<script>
import { BigNumber } from 'ethers'
export default {
  name: 'StreamStatus',
  props: {
    startBlock: [Number, Object, String],
    currentBlock: [Number, Object, String],
    remaining: [Number, Object, String], // 可以是Bigumber对象 或string格式数字
    isCanceled: Boolean
  },
  data () {
    return {}
  },
  computed: {
    status () {
      let value = 'loading'
      if (this.isCanceled) {
        return 'canceled'
      }
      console.log('startBlock, currentBlock, remaining', this.startBlock, this.currentBlock, this.remaining)

      if (this.startBlock && this.currentBlock && this.remaining) {
        const startBlock = BigNumber.from(this.startBlock).mul(10000)
        const currentBlock = BigNumber.from(this.currentBlock).mul(10000)
        const remaining = BigNumber.from(this.remaining).mul(10000)
        const minRemaining = BigNumber.from(1) // '0.0001'

        if (startBlock.lte(currentBlock)) {
          if (remaining.lte(minRemaining)) {
            value = 'ended'
          } else {
            value = 'streaming'
          }
        } else {
          value = 'waiting'
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
<style lang="scss" scoped>
  .section {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .status {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-right: 5px;

    &.loading {
      background-color: #dedede;
    }

    &.waiting {
      background-color: #666;
    }

    &.streaming {
      background-color: #7dff00;
    }

    &.canceled {
      background-color: #fc3e74;
    }

    &.ended {
      background-color: #135ca0;
    }
  }
</style>
