<template>
  <div class="container">
    <div class="header">
      <div class="content">
        <NuxtLink to="/">
          <img class="logo" src="~/assets/logo.png" alt="">
        </NuxtLink>
        <span class="nav-item active">
          <span class="text">xHalfLife</span>
          <span class="indicator" />
        </span>
        <Login style="float: right;" />
        <div style="clear: both;" />
      </div>
    </div>

    <div class="module">
      <div class="breadcrumb">
        xHalfLife <span><i class="el-icon-right" /></span> Detail
      </div>
      <div class="actions-wrap">
        <div class="detail-id">
          <span>ID：{{ detail.id }}</span>
        </div>

        <div class="actions">
          <el-button type="primary" class="action-fund" v-if="canFund">
            Fund
          </el-button>
          <el-button type="primary" class="action-withdraw" v-if="canWithDraw">
            WithDraw
          </el-button>
          <el-button type="success" class="action-cancel" v-if="canCancel">
            Cancel
          </el-button>
        </div>
      </div>
      <div class="detail-cards">
        <div class="left">
          <div class="card" shadow="always">
            <div class="header">
              Remaining
            </div>
            <div class="content">
              {{ detail.remaining | precision18 }}XDEX
            </div>
          </div>
          <div class="card" shadow="always">
            <div class="header">
              Withdrawable
            </div>
            <div class="content">
              {{ detail.withdrawable | precision18 }} XDEX
            </div>
          </div>
        </div>
        <div class="right">
          <div class="header">
            <div class="title">
              DATE
            </div>
            <div class="status">
              <stream-status
                :start-block="detail.startBlock"
                :current-block="blockNumber"
                :remaining="detail.remaining"
              />
            </div>
          </div>
          <div class="part1 block-info">
            <div class="item item1">
              <div class="label">
                StartBlock
              </div>
              <div class="value">
                #{{ detail.startBlock }}
              </div>
            </div>
            <div class="item item2">
              <div class="label">
                Unlock Ratio
              </div>
              <div class="value">
                {{ detail.unlockRatio| precision18 }}%
              </div>
            </div>
            <div class="item item3">
              <div class="label">
                Unlock K
              </div>
              <div class="value">
                {{ detail.kBlock }}
              </div>
            </div>
          </div>
          <div class="part2 sender item">
            <div class="label">
              Sender
            </div>
            <div class="value">
              {{ detail.sender }}
            </div>
          </div>
          <div class=" part3 recipent item">
            <div class="label">
              Recipent
            </div>
            <div class="value">
              {{ detail.recipient }}
            </div>
          </div>
        </div>
      </div>
      <div class="last-activity" />
    </div>
  </div>
</template>

<script>
import { STREAM_FUNDS_BY_STREAMID } from '@/api/apollo/queries'
import { mapState } from 'vuex'
import { getProvider } from '@/api/contract/ethers'

export default {
  name: 'Detail',
  data () {
    return {
      id: 0,
      blockNumber: 0,
      detail: {}
    }
  },
  computed: {
    ...mapState({
      detailCache (state) {
        return state.detailCache
      },
      account (state) {
        return state.metamask && state.metamask.account
      }
    }),
    canWithDraw () {
      const yes = this.account && this.account === this.detail.recipient && this.detail.withdrawable > 0.0001
      console.log('canWithDraw', this.account, this.recipient)
      return yes
    },
    canFund () {
      const yes = this.account && this.account === this.detail.sender
      console.log('canFund', this.account, this.sender)
      return yes
    },
    canCancel () {
      const yes = this.account && (this.account === this.detail.recipient || this.account === this.detail.sender)
      console.log('canCancel', this.account)
      return yes
    }
  },
  async mounted () {
    console.log('Home mounted', this.$route)
    const id = this.$route.query && this.$route.query.id
    this.id = id
    this.detail = this.detailCache[id]
    // this.getData()
    console.log(this.detail)
    this.blockNumber = await this.getBlockNumber()
  },
  methods: {
    async getBlockNumber () {
      const provider = await getProvider()
      const blockNumber = await provider.getBlockNumber()
      return blockNumber
    },
    async getData () {
      const ret = await this.$apollo.query({ query: STREAM_FUNDS_BY_STREAMID })
      console.log('getStreamStats', ret)
      const stats = (ret.data && ret.data.streamTotalDatas && ret.data.streamTotalDatas[0]) || {}
      this.stats = stats
    }
  }
}
</script>

<style scoped lang="scss">
  @import "~/pages/home/index.scss";
  @import "~/pages/detail.scss";
</style>
