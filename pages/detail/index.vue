<template>
  <div class="main">
    <div class="module mainContainer">
      <div class="breadcrumb">
        <NuxtLink to="/" class="breadcrumbLink">HalfLife</NuxtLink> <span><i class="el-icon-right" /></span> Detail
      </div>
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
            <div class="header">Remaining（{{detail.token.symbol}}）</div>
            <div class="content">{{ detail.remaining | decimaledAmount(detail.token.decimals)}}</div>
          </div>
          <div class="card" shadow="always">
            <div class="header">Withdrawable（{{detail.token.symbol}}）</div>
            <div class="content">
              {{ detail.withdrawable | decimaledAmount(detail.token.decimals)}}
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
                <div class="label block">StartBlock</div>
                <div class="value">#{{ detail.startBlock }}</div>
              </div>
              <div class="item item2">
                <div class="label ratio">Unlock Ratio</div>
                <div class="value">{{ detail.unlockRatio | decimaledRatio(1000, detail.token.decimals) }}‰</div>
              </div>
              <div class="item item3">
                <div class="label lockNumber">Unlock K</div>
                <div class="value">
                  {{ detail.kBlock }}
                </div>
              </div>
            </div>
            <div class="part2 sender item">
              <div class="label sender">Sender</div>
              <div class="value">
                {{ detail.sender }}
              </div>
            </div>
            <div class="part3 recipent item">
              <div class="label recipent">Recipent</div>
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
      title="Withdraw"
      :visible.sync="withdrawDialogVisible"
      :width="isMobile ? '80%' : '30%'"
    >
      <div class="dialog-content">
        <div style="padding: 10px;">
          TOTAL: {{ withdrawable }} {{detail.token.symbol}}
        </div>
        <el-input placeholder="" v-model="formWithdraw.amount">
          <el-button slot="append" @click="maxAmount('withdraw')">MAX</el-button>
        </el-input>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doWithdraw" :disabled="withdrawing" :loading="withdrawing">Confirm</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="Fund"
      :visible.sync="fundDialogVisible"
      :width="isMobile ? '80%' : '30%'"
    >
      <div class="dialog-content">
        <div style="padding: 10px;">
          TOTAL: {{ currentTokenAmount }} {{detail.token.symbol}}
        </div>
        <el-input placeholder="" v-model="formFund.amount">
          <el-button slot="append" @click="maxAmount('fund')">MAX</el-button>
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doFund" :disabled="funding" :loading="funding">Confirm</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="Cancel"
      :visible.sync="cancelDialogVisible"
      :width="isMobile ? '80%' : '30%'"
    >
      <span>Confirm do cancel ?</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doCancel" :disabled="cancelling" :loading="cancelling">Confirm</el-button>
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
import { mapState } from 'vuex'
import { isMobile, statusedList, decimalsNumber } from '@/utils/index'
import { selectAbi } from '@/api/contract'

export default {
  name: 'Detail',
  data () {
    return {
      id: 0,
      detail: {
        token: {
          symbol: '',
          id: '',
          decimals: ''
        }
      },
      withdrawable: 0,
      currentTokenAmount: 0,
      withdrawDialogVisible: false,
      fundDialogVisible: false,
      cancelDialogVisible: false,
      loading: false,
      withdrawing: false,
      funding: false,
      cancelling: false,
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
    },
    'detail.token.id' (newVal, oldVal) {
      if (newVal) {
        this.tokenBalance()
      }
    }
  },
  mounted () {
    console.log('Home mounted', this.$route)
    const id = this.$route.query && this.$route.query.id
    this.id = id
    this.detail = { ...this.detail, ...this.detailCache[id] }
    this.$store.dispatch('refreshLatestBlockNumber')

    // 请求最新
    if (id) {
      this.getDetail(id)
      this.getStreamBalance(id)
    }
  },
  methods: {
    async tokenBalance () {
      const provider = await getProvider()
      const signer = await provider.getSigner()
      if (this.detail.token.id) {
        if (this.detail.token.id === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
          const balance = await signer.getBalance()
          this.currentTokenAmount = ethers.utils.formatEther(balance)
        } else {
          const tokenContract = new ethers.Contract(this.detail.token.id, selectAbi(this.detail.token.symbol), signer)
          const balanceOf = await tokenContract.balanceOf(this.account)
          this.currentTokenAmount = decimalsNumber(balanceOf, this.detail.token.decimals)
        }
      } else {
        this.currentTokenAmount = 0
      }
    },
    async getDetail (id) {
      const ret = await this.$apollo.query({ query: STREAM_DETAIL, variables: { id: Number(id) } })
      this.$store.commit('updateSteamDetail', ret.data.streams && statusedList(ret.data.streams)[0])
    },
    async getStreamBalance (id) {
      console.log('getStreamBalance', id)
      try {
        const ret = await XHalfLifeContract.balanceOf(id)
        console.log('getStreamBalance', id, ret)
        this.withdrawable = ethers.utils.formatUnits(ret.withdrawable, this.detail.token.decimals)
        this.$store.commit('updateBalanceByStreamId', { key: id, value: ret })
      } catch (e) {
        console.error(e)
      }
    },
    async doWithdraw () {
      // TODO
      if (!this.formWithdraw.amount > 0) {
        this.$message({
          message: 'Invalid number',
          type: 'warning'
        })
        return
      }
      if (!this.formWithdraw.amount > this.detail.withdrawable) {
        this.$message({
          message: 'Invalid Number',
          type: 'warning'
        })
        return
      }
      this.withdrawing = true

      try {
        // 获得provider
        const provider = await getProvider()
        const signer = provider.getSigner()
        const contract = new ethers.Contract(process.env.XHALFLIFE_CONTRACT_ADDTRESS, XHalfLifeABI, signer)

        // 表单数据
        this.formWithdraw.streamId = this.id
        const { streamId } = this.formWithdraw
        const decimaledAmount = await ethers.utils.parseUnits(this.formWithdraw.amount, this.detail.token.decimals).toString()

        // 提交
        const tx = await contract.withdrawFromStream(streamId, decimaledAmount)
        const txResult = await tx.wait()

        console.log('doWithdraw ret', txResult)
        this.$message({
          message: 'Withdraw successfully',
          type: 'success'
        })
        this.withdrawing = false
        this.withdrawDialogVisible = false
        this.getDetail(streamId)
        this.getStreamBalance(streamId)
      } catch (e) {
        this.$message({
          message: e.message,
          type: 'warning'
        })
        this.withdrawing = false
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

      this.funding = true

      try {
        // 获得provider
        const provider = await getProvider()
        const signer = provider.getSigner()
        const contract = new ethers.Contract(process.env.XHALFLIFE_CONTRACT_ADDTRESS, XHalfLifeABI, signer)
        const tokenContract = new ethers.Contract(this.detail.token.id, selectAbi(this.detail.token.symbol), signer)

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
        const { streamId } = this.formFund
        const decimaledAmount = ethers.utils.parseUnits(this.formFund.amount, this.detail.token.decimals).toString()

        let tx
        if (this.detail.token.id !== '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
          // 查看 XHALFLIFE_CONTRACT的已有授权额度， 不够则出发approve流程
          const allowance = await tokenContract.allowance(accounts[0], process.env.XHALFLIFE_CONTRACT_ADDTRESS)
          console.log('allowance', allowance, accounts[0])
          const depositAmountBig = ethers.BigNumber.from(decimaledAmount)
          if (depositAmountBig.lte(allowance)) {
            console.log('allowance is enough', allowance.toString(), depositAmountBig.toString())
          } else {
            console.log('allowance is not enough', allowance.toString(), depositAmountBig.toString())
            // approve
            const approveValue = depositAmountBig.sub(allowance)
            console.log('Need approve', approveValue)
            const approveTx = await tokenContract.approve(process.env.XHALFLIFE_CONTRACT_ADDTRESS, approveValue)
            const approveResult = await approveTx.wait()
            console.log('approveResult', approveResult)
          }
          tx = await contract.fundStream(streamId, decimaledAmount.toString())
        } else {
          tx = await contract.fundStream(streamId, decimaledAmount.toString(), { value: decimaledAmount.toString() })
        }
        const txResult = await tx.wait()
        console.log('doWithdraw ret', txResult)
        this.$message({
          message: 'Fund successfully',
          type: 'success'
        })
        this.funding = false
        this.fundDialogVisible = false
        this.getDetail(streamId)
        this.getStreamBalance(streamId)
      } catch (e) {
        this.$message({
          message: e.message,
          type: 'warning'
        })
        this.funding = false
        this.fundDialogVisible = false
      }
    },
    async doCancel () {
      this.cancelling = true
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
        this.cancelling = false
        this.cancelDialogVisible = false
      } catch (e) {
        this.$message({
          message: e.message,
          type: 'warning'
        })
        this.cancelling = false
        this.cancelDialogVisible = false
      }
    },
    maxAmount (type) {
      if (type === 'fund') {
        this.formFund.amount = this.currentTokenAmount
      } else if (type === 'withdraw') {
        this.formWithdraw.amount = ethers.utils.formatUnits(this.detail.withdrawable, this.detail.token.decimals)
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
