<template>
  <div class="main">
    <div class="module module-stat">
      <div class="card card-1">
        <div class="label">{{ $t('home.totalStreams') }}</div>
        <div class="value">{{ stats.count }}</div>
      </div>
      <div class="card card-2">
        <div class="label">{{ $t('home.XDEXLocked') }}</div>
        <div class="value">{{ stats.locked | toFixed }}</div>
      </div>
      <div class="card card-3">
        <div class="label">{{ $t('home.XDEXWithdrawed') }}</div>
        <div class="value">{{ stats.withdrawed | toFixed }}</div>
      </div>
    </div>

    <div class="module module-tabs">
      <div class="navs">
        <div class="nav" :class="{ active: activeTab == 'streams' }" @click="onSwitchTab('streams')">{{ $t('home.Streams') }}</div>
        <div class="nav" :class="{ active: activeTab == 'mine' }" @click="onSwitchTab('mine')">{{ $t('home.Mine') }}</div>
        <div class="nav" :class="{ active: activeTab == 'create' }" @click="onSwitchTab('create')">{{ $t('home.New') }}</div>
      </div>
      <div class="content">
        <div v-if="activeTab == 'streams'">
          <div><StreamList ref="refreshList"></StreamList></div>
        </div>
        <div v-else-if="activeTab == 'mine'">
          <div><stream-list-mine /></div>
        </div>
        <div v-else><create-stream-form @refresh="refresh"/></div>
      </div>
    </div>
  </div>
</template>

<script>
import { STREAM_GET_TOTAL_DATA } from '@/api/apollo/queries'
import CreateStreamForm from '@/pages/home/components/CreateStreamForm'
import StreamList from '@/pages/home/components/StreamList'
import StreamListMine from '@/pages/home/components/StreamListMine'
import { isMobile, decimalsNumber } from '@/utils/index'
import { ethers } from 'ethers'
import { getProvider } from '@/api/contract/ethers'
import XhalfLife from '@/api/contract/abis/XHalfLife.json'

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
      activeTab: 'streams',

      drawer: false,
      direction: 'ttb',
      isMobile: isMobile()
    }
  },
  mounted () {
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
      this.$nextTick(() => {
        this.activeTab = v
      })
    },
    refresh(){
      this.onSwitchTab('streams')
      setTimeout(()=>{
        this.$refs.refreshList.getList()
      },20)

    },
    async getStreamStats () {
      const ret = await this.$apollo.query({ query: STREAM_GET_TOTAL_DATA, variables: { id: process.env.XDEX_TOKEN_ADDRESS.toLowerCase() } })

      const provider = await getProvider()
      const proxyContract = new ethers.Contract(process.env.XHALFLIFE_CONTRACT_ADDTRESS, XhalfLife, provider)
      const totalStreams = await proxyContract.nextStreamId()
      const totalStream = decimalsNumber(totalStreams, 0)

      const stats = (ret.data && ret.data.streamTotalDatas && ret.data.streamTotalDatas[0]) || {}
      this.stats = { ...stats, count: totalStream - 1 }
      this.$store.commit('updateStats', { ...stats, count: totalStream - 1 })
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
