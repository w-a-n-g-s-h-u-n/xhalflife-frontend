<template>
  <div />
</template>

<script>
import { XHalfLifeContract } from '@/api/contract'
export default {
  name: 'StreamBalance',
  props: {
    id: String,
    row: Object
  },
  mounted () {
    console.log('created', this.id)
    if (this.id) {
      this.getData(this.id)
    }
  },
  methods: {
    async getData (id) {
      console.log('getData', id)

      try {
        const ret = await XHalfLifeContract.balanceOf(id)
        console.log(id, ret)
        // this.row.remaining = ret.remaining
        // this.row.withdrawable = ret.withdrawable
        this.$store.commit('updateBalanceByStreamId', { key: id, value: ret })
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>

<!--<style scoped>-->

<!--</style>-->
