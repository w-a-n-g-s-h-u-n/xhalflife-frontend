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
          <span>ID：{{ id }}</span>
        </div>

        <div class="actions">
          <el-button v-if="canFund" type="primary" class="action-fund" @click="fundDialogVisible =true">
            Fund
          </el-button>
          <el-button v-if="canWithDraw" type="primary" class="action-withdraw" @click="withdrawDialogVisible=true">
            WithDraw
          </el-button>
          <el-button v-if="canCancel" type="success" class="action-cancel" @click="cancelDialogVisible=true">
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
        <div class="right card">
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
          <div class="content">
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
      </div>
      <div class="card last-activity">
        <div class="header">
          Last Activity
        </div>
        <div class="content">
          <div class="part part1">
            <div class="item item1">
              Date
            </div>
            <div class="item item2">
              08 Jan 2019
            </div>
          </div>
          <div class="part part2">
            <div class="item item1">
              Amount
            </div>
            <div class="item item2">
              1.5901 USDT
            </div>
          </div>
          <div class="part part3">
            <div class="item item1">
              Receiver
            </div>
            <div class="item item2">
              0xd0A1...029C
            </div>
          </div>
          <div class="part part4">
            <div class="item item1">
              TRX ID
            </div>
            <div class="item item2">
              0xd0A1...029C
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      title="提示"
      :visible.sync="withdrawDialogVisible"
      width="30%"
      center
    >
      <span>需要注意的是内容是默认不居中的</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="withdrawDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="提示"
      :visible.sync="fundDialogVisible"
      width="30%"
      center
    >
      <span>需要注意的是内容是默认不居中的</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="fundDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="提示"
      :visible.sync="cancelDialogVisible"
      width="30%"
      center
    >
      <span>需要注意的是内容是默认不居中的</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancelDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { STREAM_DETAIL } from '@/api/apollo/queries'
import { XHalfLifeContract } from '@/api/contract'

import { mapState } from 'vuex'

export default {
  name: 'Detail',
  data () {
    return {
      id: 0,
      detail: {},
      withdrawDialogVisible: false,
      fundDialogVisible: false,
      cancelDialogVisible: false
    }
  },
  computed: {
    ...mapState({
      blockNumber (state) {
        return state.blockNumber
      },
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
  watch: {
    detailCache () {
      this.detail = { ...this.detail, ...this.detailCache[this.id] }
    }
  },
  mounted () {
    console.log('Home mounted', this.$route)
    const id = this.$route.query && this.$route.query.id
    this.id = id
    this.detail = { ...this.detail, ...this.detailCache[id] }
    // this.getData()
    console.log(this.detail)
    this.$store.dispatch('refreshLatestBlockNumber')

    // 请求最新
    if (id) {
      this.getDetail(id)
      this.getStreamBalance(id)
    }
  },
  methods: {
    // async getData () {
    //   const ret = await this.$apollo.query({ query: STREAM_FUNDS_BY_STREAMID })
    //   console.log('getStreamStats', ret)
    //   const stats = (ret.data && ret.data.streamTotalDatas && ret.data.streamTotalDatas[0]) || {}
    //   this.stats = stats
    // },
    async getDetail (id) {
      const ret = await this.$apollo.query({ query: STREAM_DETAIL, variables: { id: Number(id) } })
      console.log('getDetail', ret)
      this.$store.commit('updateSteamDetail', ret.data.streams && ret.data.streams[0])
    },
    async getStreamBalance (id) {
      console.log('getStreamBalance', id)
      try {
        const ret = await XHalfLifeContract.balanceOf(id)
        console.log('getStreamBalance', id, ret)
        this.$store.commit('updateBalanceByStreamId', { key: id, value: ret })
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>

<style scoped lang="scss">
  @import "~/pages/home/index.scss";
  @import "./index.scss";
</style>
