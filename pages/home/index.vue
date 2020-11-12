<template>
  <div class="container">
    <div>
      <Logo />
      <h1 class="title">
        xhalflife
      </h1>
    </div>
  </div>
</template>

<script>

import { STREAM_LIST } from '@/api/apollo/queries'
export default {
  data () {
    return {
      a: process.env.A
    }
  },
  async mounted () {
    console.log('TEST $apollo query')
    const ret = await this.$apollo.query({ query: STREAM_LIST, variables: { first: 10 } })
    console.log('ret', ret)
  }
}
</script>

<style lang="scss" scoped>
  @import "./index.scss";
</style>
