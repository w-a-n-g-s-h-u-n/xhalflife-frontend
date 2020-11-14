<template>
  <div class="container">
    <div class="header">
      <div class="content">
        <img class="logo" src="~/assets/logo.png" alt="">
        <span class="nav-item active">
          <span class="text">xHalfLife</span>
          <span class="indicator"></span>
        </span>
        <Login style="float: right;" />
        <div style="clear: both;" />
      </div>
    </div>

    <div class="main">
      <div class="module module-one">
        <div class="card-1">
          {{ stats.totalCount }}
        </div>
        <div class="card-2">
          {{ stats.xdexLocked }}
        </div>
        <div class="card-3">
          {{ stats.xdexWithdrawed }}
        </div>
      </div>
      <div class="module">
        <el-tabs type="border-card" tab-position="left">
          <el-tab-pane label="全部">
            <stream-list />
          </el-tab-pane>
          <el-tab-pane label="我的">
            <stream-list-mine />
          </el-tab-pane>
          <el-tab-pane label="创建">
            <create-stream-form />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="footer">Footer</div>
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
      }
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
    async getStreamStats () {
      const ret = await this.$apollo.query({ query: STREAM_GET_TOTAL_DATA })
      console.log('getStreamStats', ret)
      const stats = (ret.data && ret.data.streamTotalDatas && ret.data.streamTotalDatas[0]) || {}
      this.stats = stats
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "./index.scss";
</style>
