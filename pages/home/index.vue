<template>
  <div class="container">
    <Login />
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
import { getProvider } from '@/api/contract/ethers'
import { XHalfLife } from '@/api/contract'
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

    const provider = getProvider()
    console.log('provider', provider)

    const balance = await provider.getBalance('0xc3bcc607335ae9EA59736700A87C1E3bc0ec32D9')
    console.log(balance.toString())

    const v = await XHalfLife.getVersion()
    console.log('XHalfLife getVersion', v)

    // const b2 = await XHalfLifeIns.balanceOf('0xc3bcc607335ae9EA59736700A87C1E3bc0ec32D9')
  }
}
</script>

<style lang="scss" scoped>
  @import "./index.scss";
</style>
