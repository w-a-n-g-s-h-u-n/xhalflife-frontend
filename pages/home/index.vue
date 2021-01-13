<template>
  <div class="main">
      <div class="module module-stat">
        <div class="card card-1">
          <div class="label">
            Total Streams
          </div>
          <div class="value">
            {{ stats.count }}
          </div>
        </div>
        <div class="card card-2">
          <div class="label">
            XDEX Toatal Locked
          </div>
          <div class="value">
            {{ stats.locked | toFixed }}
          </div>
        </div>
        <div class="card card-3">
          <div class="label">
            XDEX Withdrawed
          </div>
          <div class="value">
            {{ stats.withdrawed | toFixed }}
          </div>
        </div>
      </div>

      <div class="module module-tabs">
        <div class="navs">
          <div class="nav" :class="{'active':activeTab=='a'}" @click="onSwitchTab('a')">
            Streams
          </div>
          <div class="nav" :class="{'active':activeTab=='b'}" @click="onSwitchTab('b')">
            Mine
          </div>
          <div class="nav" :class="{'active':activeTab=='c'}" @click="onSwitchTab('c')">
            New
          </div>
        </div>
        <div class="content">
          <div v-if="activeTab=='a'">
            <div>
              <stream-list />
            </div>
          </div>
          <div v-else-if="activeTab=='b'">
            <div>
              <stream-list-mine />
            </div>
          </div>
          <div v-else>
            <create-stream-form />
          </div>
        </div>
      </div>
    </div>
</template>

<script>

import { STREAM_GET_TOTAL_DATA } from '@/api/apollo/queries'
import CreateStreamForm from '@/pages/home/components/CreateStreamForm'
import StreamList from '@/pages/home/components/StreamList'
import StreamListMine from '@/pages/home/components/StreamListMine'
import { isMobile } from '@/utils/index'
export default {
  components: {
    CreateStreamForm,
    StreamList,
    StreamListMine
  },
  data () {
    return {
      stats: {
        // totalCount: "4"
        // xdexLocked: "1751482191135041897338"
        // xdexWithdrawed: "31374951721958102662"
      },
      activeTab: 'a',

      drawer: false,
      direction: 'ttb',
      isMobile: isMobile()
    }
  },
  mounted () {
    console.log('Home mounted')
    this.getStreamStats()
    // console.log('TEST $apollo query')
    // const ret = await this.$apollo.query({ query: STREAM_LIST, variables: { first: 10 } })
    // console.log('ret', ret)

    // const provider = getProvider()
    // console.log('provider', provider)
    //
    // const balance = await provider.getBalance('0xc3bcc607335ae9EA59736700A87C1E3bc0ec32D9')
    // console.log(balance.toString())

    // const v = await XHalfLifeContract.nextStreamId()
    // console.log('XHalfLifeContract nextStreamId', v)

    // const b2 = await XHalfLifeContract.balanceOf('0xc3bcc607335ae9EA59736700A87C1E3bc0ec32D9')
  },
  methods: {
    onSwitchTab (v) {
      console.log('onSwitchTab', v)
      this.$nextTick(() => {
        this.activeTab = v
      })
    },
    async getStreamStats () {
      console.log('token', process.env.XDEX_TOKEN_ADDRESS.toLowerCase())
      const ret = await this.$apollo.query({ query: STREAM_GET_TOTAL_DATA, variables: { id: process.env.XDEX_TOKEN_ADDRESS.toLowerCase() } })
      console.log('getStreamStats', ret)
      const stats = (ret.data && ret.data.streamTotalDatas && ret.data.streamTotalDatas[0]) || {}
      this.stats = stats
      this.$store.commit('updateStats', stats)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "./index.scss";
</style>
