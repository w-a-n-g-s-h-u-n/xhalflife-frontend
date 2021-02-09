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
import { getProvider, provider } from '@/api/contract/ethers'
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
      },
      activeTab: 'streams',
      drawer: false,
      direction: 'ttb',
      isMobile: isMobile()
    }
  },
  mounted () {
    this.getStreamStats()
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
      },5000)
    },
    async getStreamStats () {
      const ret = await this.$apollo.query({ query: STREAM_GET_TOTAL_DATA, variables: { id: process.env.XDEX_TOKEN_ADDRESS.toLowerCase() } })
      //const provider = await getProvider()
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
