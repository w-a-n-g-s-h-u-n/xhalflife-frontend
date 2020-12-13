<template>
  <div class="main">
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
          <!--block: 21538074-->
          <!--event: "WithdrawFromStream"-->
          <!--from: "0x93be566bae0f7c21aab1662879f55767dd4c594b"-->
          <!--timestamp: "1602747020"-->
          <!--to: "0x97721b4c8bf7aedf936af11d18e2f1ef5af4836b"-->
          <!--txhash: "0xb3a71fcfd1af6e75ac211cc9428e8d123d16cb37ef5915b3e4b3a6003ebcf89f"-->
          <!--__typename: "StreamTransaction"-->
          <el-row >
            <el-col :span="6" class="part part1">
              <div class="item item1">
                Date
              </div>
            </el-col>
            <el-col :span="6" class="part part2">
              <div class="item item1">
                From
              </div>
            </el-col>
            <el-col :span="6" class="part part3">
              <div class="item item1">
                To
              </div>
            </el-col>
            <el-col :span="6" class="part part4">
              <div class="item item1">
                TRX ID
              </div>
            </el-col>
          </el-row>
          <el-row v-for="item in (detail.txs || [])" :key="item.timestamp">
            <el-col :span="6" class="part part1">
              <div class="item item2">
                {{item.timestamp | date}}
              </div>
            </el-col>
            <el-col :span="6" class="part part2">
              <div class="item item2">
                {{item.from | addr}}
              </div>
            </el-col>
            <el-col :span="6" class="part part3">
              <div class="item item2">
                {{item.to | addr}}

              </div>
            </el-col>
            <el-col :span="6" class="part part4">
              <div class="item item2">
                {{item.txhash | addr}}
              </div>
            </el-col>
          </el-row>
        </div>

      </div>
    </div>
    <el-dialog
      title="提款"
      :visible.sync="withdrawDialogVisible"
      width="30%"
      center
    >
      <div class="dialog-content">
        <div style="padding: 10px;" >
          TOTAL: {{ detail.withdrawable | precision18 }} XDEX
        </div>
        <el-input placeholder="" v-model="formWithdraw.amount">
          <template slot="append">MAX</template>
        </el-input>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doWithdraw">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="存款"
      :visible.sync="fundDialogVisible"
      width="30%"
      center
    >
      <div class="dialog-content">
        <div style="padding: 10px;" >
          TOTAL: {{ detail.withdrawable | precision18 }} XDEX
        </div>
        <el-input placeholder="" v-model="formFund.amount">
          <template slot="append">MAX</template>
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doFund">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="取消"
      :visible.sync="cancelDialogVisible"
      width="30%"
      center
    >
      <!--<span>需要注意的是内容是默认不居中的</span>-->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doCancel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { STREAM_DETAIL } from '@/api/apollo/queries'
import { XHalfLifeContract } from '@/api/contract'
import { getProvider } from '@/api/contract/ethers'
import metamask from '@/api/wallet/metamask'

import { ethers } from 'ethers'
import XHalfLifeABI from '@/api/contract/abis/XHalfLife'
import XDEX_ABI from '@/api/contract/abis/XDEX'

import { mapState } from 'vuex'

export default {
  name: 'Detail',
  data () {
    return {
      id: 0,
      detail: {},
      withdrawDialogVisible: false,
      fundDialogVisible: false,
      cancelDialogVisible: false,
      formWithdraw: {
        amount: 0
      },
      formFund: {
        amount: 0
      }
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
    },
    async doWithdraw () {
      // TODO
      if (!this.formWithdraw.amount > 0) {
        this.$message({
          message: '数值太小',
          type: 'warning'
        })
        return
      }
      if (!this.formWithdraw.amount > this.detail.withdrawable) {
        this.$message({
          message: '数值太大',
          type: 'warning'
        })
        return
      }

      try {
        // 获得provider
        const provider = await getProvider()
        const signer = provider.getSigner()
        const contract = new ethers.Contract(process.env.XHALFLIFE_CONTRACT_ADDTRESS, XHalfLifeABI, signer)
        // const contractXDEX = new ethers.Contract(process.env.XDEX_TOKEN_ADDRESS, XDEX_ABI, signer)

        // 表单数据
        this.formWithdraw.streamId = this.id
        this.formWithdraw.amount = ethers.utils.parseUnits(this.formWithdraw.amount, 18).toString()
        console.log(this.formWithdraw)
        const { streamId, amount } = this.formWithdraw

        // 提交
        const tx = await contract.withdrawFromStream(streamId, amount)
        const txResult = await tx.wait()

        console.log('doWithdraw ret', txResult)
        this.$message({
          message: 'Withdraw successfully',
          type: 'success'
        })
        this.withdrawDialogVisible = false
      } catch (e) {
        this.$message({
          message: e.message,
          type: 'warning'
        })
        this.withdrawDialogVisible = false
      }
    },
    async doFund () {
      // TODO
      if (!this.formFund.amount > 0) {
        this.$message({
          message: '数值太小',
          type: 'warning'
        })
        return
      }
      if (!this.formFund.amount > this.detail.withdrawable) {
        this.$message({
          message: '数值太大',
          type: 'warning'
        })
        return
      }

      try {
        // 获得provider
        const provider = await getProvider()
        const signer = provider.getSigner()
        const contract = new ethers.Contract(process.env.XHALFLIFE_CONTRACT_ADDTRESS, XHalfLifeABI, signer)
        const contractXDEX = new ethers.Contract(process.env.XDEX_TOKEN_ADDRESS, XDEX_ABI, signer)

        const accounts = await metamask.connectMetaMask()
        if (!accounts.length) {
          this.$message({
            message: 'Need connect to metemask account first',
            type: 'warning'
          })
          return
        }

        // 表单数据
        this.formFund.streamId = this.id
        this.formFund.amount = ethers.utils.parseUnits(this.formFund.amount, 18).toString()
        console.log(this.formFund)
        const { streamId, amount } = this.formFund

        // 查看 XHALFLIFE_CONTRACT的已有授权额度， 不够则出发approve流程
        const allowance = await contractXDEX.allowance(accounts[0], process.env.XHALFLIFE_CONTRACT_ADDTRESS)
        console.log('allowance', allowance, accounts[0])

        const depositAmountBig = ethers.BigNumber.from(amount)
        if (depositAmountBig.lte(allowance)) {
          console.log('allowance is enough', allowance.toString(), depositAmountBig.toString())
        } else {
          console.log('allowance is not enough', allowance.toString(), depositAmountBig.toString())
          // approve
          const approveValue = depositAmountBig.sub(allowance)
          console.log('Need approve', approveValue)
          const approveTx = await contractXDEX.approve(process.env.XHALFLIFE_CONTRACT_ADDTRESS, approveValue)
          const approveResult = await approveTx.wait()
          console.log('approveResult', approveResult)
          // this.$message('Please wait MetaMast to approve')
        }

        // 提交
        const tx = await contract.fundStream(streamId, amount.toString())
        const txResult = await tx.wait()

        console.log('doFund ret', txResult)
        this.$message({
          message: 'Fund successfully',
          type: 'success'
        })
        this.fundDialogVisible = false
      } catch (e) {
        this.$message({
          message: e.message,
          type: 'warning'
        })
        this.fundDialogVisible = false
      }
    },
    async doCancel () {
      try {
        // 获得provider
        const provider = await getProvider()
        const signer = provider.getSigner()
        const contract = new ethers.Contract(process.env.XHALFLIFE_CONTRACT_ADDTRESS, XHalfLifeABI, signer)

        const streamId = this.id
        if (!streamId) {
          this.$message({
            message: 'Missing streamId ',
            type: 'warning'
          })
          return
        }

        // 提交
        const tx = await contract.cancelStream(streamId)
        const txResult = await tx.wait()
        console.log('doCancel result', txResult)

        this.$message({
          message: 'Cancel successfully',
          type: 'success'
        })
        this.cancelDialogVisible = false
      } catch (e) {
        this.$message({
          message: e.message,
          type: 'warning'
        })
        this.cancelDialogVisible = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
  @import "~/pages/home/index.scss";
  @import "./index.scss";
</style>
