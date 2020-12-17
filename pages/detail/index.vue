<template>
  <div class="main">
    <div class="module mainContainer">
      <div class="actions-wrap">
        <div class="detail-id">
          <span>ID：{{ id }}</span>
        </div>

        <div class="actions">
          <el-button
            v-if="canFund"
            type="primary"
            class="action-fund"
            @click="fundDialogVisible = true"
            :size="isMobile ? 'small' : 'medium'"
          >
            Fund
          </el-button>
          <el-button
            v-if="canWithDraw"
            type="primary"
            class="action-withdraw"
            @click="withdrawDialogVisible = true"
            :size="isMobile ? 'small' : 'medium'"
          >
            WithDraw
          </el-button>
          <el-button
            v-if="canCancel"
            type="success"
            class="action-cancel"
            @click="cancelDialogVisible = true"
            :size="isMobile ? 'small' : 'medium'"
          >
            Cancel
          </el-button>
        </div>
      </div>
      <div class="detail-cards">
        <div class="left">
          <div class="card" shadow="always">
            <div class="header">Remaining（XDEX）</div>
            <div class="content">{{ detail.remaining | precision18 }}</div>
          </div>
          <div class="card" shadow="always">
            <div class="header">Withdrawable（XDEX）</div>
            <div class="content">
              {{ detail.withdrawable | precision18 }}
            </div>
          </div>
        </div>
        <div class="right card">
          <div class="header">
            <div class="title">
              Detail
            </div>
            <div class="status">
              <stream-status
                :start-block="detail.startBlock"
                :current-block="blockNumber"
                :remaining="detail.remaining"
                :isCanceled="detail.isCanceled"
              />
            </div>
          </div>
          <div class="content">
            <div class="part1 block-info">
              <div class="item item1">
                <div class="label">StartBlock</div>
                <div class="value">#{{ detail.startBlock }}</div>
              </div>
              <div class="item item2">
                <div class="label">Unlock Ratio</div>
                <div class="value">{{ detail.unlockRatio | precision18 }}%</div>
              </div>
              <div class="item item3">
                <div class="label">Unlock K</div>
                <div class="value">
                  {{ detail.kBlock }}
                </div>
              </div>
            </div>
            <div class="part2 sender item">
              <div class="label">Sender</div>
              <div class="value">
                {{ detail.sender }}
              </div>
            </div>
            <div class="part3 recipent item">
              <div class="label">Recipent</div>
              <div class="value">
                {{ detail.recipient }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card last-activity">
        <div class="header">
          Lastest Activity
        </div>
        <el-table
          v-loading="loading"
          :data="detail.txs"
          class="table"
          :cell-style="cellStyle"
          :header-cell-style="cellStyle"
        >
          <el-table-column label="Date" min-width="120">
            <template slot-scope="scope">
              <span :title="scope.row.timestamp">{{
                scope.row.timestamp | date
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Event" align='center' min-width="120">
            <template slot-scope="scope">
              <span :title="scope.row.event">{{ scope.row.event }}</span>
            </template>
          </el-table-column>
          <el-table-column label="From" align='center' min-width="120">
            <template slot-scope="scope">
              <span :title="scope.row.from">{{ scope.row.from | addr }}</span>
            </template>
          </el-table-column>
          <el-table-column label="To" align='center' min-width="120">
            <template slot-scope="scope">
              <span :title="scope.row.to">{{ scope.row.to | addr }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Txhash" align="right">
            <template slot-scope="scope">
              <span><a :title="scope.row.txhash" target="_blank" :href="`https://kovan.etherscan.io/tx/${scope.row.txhash}`" style='color: inherit;'>{{ scope.row.txhash | addr }}</a></span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog
      title="提款"
      :visible.sync="withdrawDialogVisible"
    >
      <div class="dialog-content">
        <div style="padding: 10px;">
          TOTAL: {{ detail.withdrawable | precision18 }} XDEX
        </div>
        <el-input placeholder="" v-model="formWithdraw.amount">
          <el-button slot="append" @click="maxAmount('withdraw')">MAX</el-button>
        </el-input>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doWithdraw">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="存款"
      :visible.sync="fundDialogVisible"
    >
      <div class="dialog-content">
        <div style="padding: 10px;">
          TOTAL: {{ xdexBalance }} XDEX
        </div>
        <el-input placeholder="" v-model="formFund.amount">
          <el-button slot="append" @click="maxAmount('fund')">MAX</el-button>
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doFund">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="取消"
      :visible.sync="cancelDialogVisible"
    >
      <span>确定取消</span>
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
import { isMobile } from '@/utils/index'

import { ethers } from 'ethers'
import XHalfLifeABI from '@/api/contract/abis/XHalfLife'
import XDEX_ABI from '@/api/contract/abis/XDEX'

import { mapState } from 'vuex'
import { statusedList, decimalsNumber } from '@/utils/index'

export default {
  name: 'Detail',
  data () {
    return {
      id: 0,
      detail: {},
      withdrawDialogVisible: false,
      fundDialogVisible: false,
      cancelDialogVisible: false,
      loading: false,
      formWithdraw: {
        amount: 0
      },
      isMobile: isMobile(),
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
      },
      xdexBalance (state) {
        return state.metamask && state.metamask.balances
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
      this.$store.commit('updateSteamDetail', ret.data.streams && statusedList(ret.data.streams)[0])
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
        const { streamId } = this.formWithdraw
        const decimaledAmount = ethers.utils.parseUnits(this.formWithdraw.amount, 18).toString()

        // 提交
        const tx = await contract.withdrawFromStream(streamId, decimaledAmount)
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
    },
    maxAmount (type) {
      if (type === 'fund') {
        this.formFund.amount = this.xdexBalance
      } else if (type === 'withdraw') {
        this.formWithdraw.amount = decimalsNumber(this.detail.withdrawable)
      }
    },
    cellStyle (obj) {
      return 'background-color:#272958;border-bottom-color:#2E2F5C;color:#7E7F9C;'
    }
  }
}
</script>

<style scoped lang="scss">
@import "~/pages/home/index.scss";
@import "./index.scss";
</style>
