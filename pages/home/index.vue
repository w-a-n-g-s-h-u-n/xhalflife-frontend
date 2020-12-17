<template>
  <div class="main">
      <div class="module module-stat">
        <div class="card card-1">
          <div class="label">
            Total Streams
          </div>
          <div class="value">
            {{ stats.totalCount }}
          </div>
        </div>
        <div class="card card-2">
          <div class="label">
            XDEX Toatal Locked
          </div>
          <div class="value">
            {{ stats.xdexLocked | precision18 }}
          </div>
        </div>
        <div class="card card-3">
          <div class="label">
            XDEX Withdrawed
          </div>
          <div class="value">
            {{ stats.xdexWithdrawed | precision18 }}
          </div>
        </div>
        <div style="clear: both;" />
      </div>

      <!--      <div class="module module-tabs">-->
      <!--        <el-tabs type="border-card" tab-position="left">-->
      <!--          <el-tab-pane label="全部">-->
      <!--            <stream-list />-->
      <!--          </el-tab-pane>-->
      <!--          <el-tab-pane label="我的">-->
      <!--            <stream-list-mine />-->
      <!--          </el-tab-pane>-->
      <!--          <el-tab-pane label="创建">-->
      <!--            <create-stream-form />-->
      <!--          </el-tab-pane>-->
      <!--        </el-tabs>-->
      <!--      </div>-->

      <div class="module module-tabs">
        <div class="navs">
          <div class="nav" :class="{'active':activeTab=='a'}" @click="onSwitchTab('a')">
            全部
          </div>
          <div class="nav" :class="{'active':activeTab=='b'}" @click="onSwitchTab('b')">
            我的
          </div>

          <div class="nav" :class="{'active':activeTab=='c'}" @click="onSwitchTab('c')">
            新建
          </div>
        </div>
        <div class="content">
          <div v-if="activeTab=='a'" style="position: absolute; left: 0; top: 0;">
            <div style=" height: 100%;">
              <stream-list />
            </div>
          </div>
          <div v-else-if="activeTab=='b'" style="position: absolute; left: 0; top: 0;">
            <div style=" height: 100%;">
              <stream-list-mine />
            </div>
          </div>
          <div v-else>
            <create-stream-form style="width: 500px; margin: 0 auto;" />
          </div>
        </div>
        <div style="clear: both;" />
      </div>
    </div>
</template>

<script>

import { STREAM_GET_TOTAL_DATA } from '@/api/apollo/queries'
// import { getProvider } from '@/api/contract/ethers'
// import { XHalfLifeContract } from '@/api/contract'

import CreateStreamForm from '@/pages/home/components/CreateStreamForm'
import StreamList from '@/pages/home/components/StreamList'
import StreamListMine from '@/pages/home/components/StreamListMine'
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
      direction: 'ttb'
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
      const ret = await this.$apollo.query({ query: STREAM_GET_TOTAL_DATA })
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
