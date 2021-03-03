<template>
  <div class="main">
    <div class="module mainContainer">
      <div class="breadcrumb">
        <NuxtLink to="/" class="breadcrumbLink">
          {{ $t('nav.HalfLife') }}
        </NuxtLink> <span><i class="el-icon-right" /></span> {{ $t('detail.detail') }}
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
            :size="isMobile ? 'small' : 'medium'"
            @click="fundDialogVisible = true"
          >
            {{ $t('detail.Fund') }}
          </el-button>
          <el-button
            v-if="canWithDraw"
            type="primary"
            class="action-withdraw"
            :size="isMobile ? 'small' : 'medium'"
            @click="withdrawDialogVisible = true"
          >
            {{ $t('detail.WithDraw') }}
          </el-button>
          <el-button
            v-if="canCancel"
            type="text"
            class="action-cancel"
            :size="isMobile ? 'small' : 'medium'"
            @click="cancelDialogVisible = true"
          >
            {{ $t('detail.Cancel') }}
          </el-button>
        </div>
      </div>
      <div class="detail-cards">
        <div class="left">
          <div class="card" shadow="always">
            <div class="header">
              {{ $t('detail.Remaining') }}（
              <i v-if="!detail.imgShow">?</i>
              <img v-else :src="detail.imgUrl">
              {{ detail.token.symbol }}）
            </div>
            <div class="content">
              ～{{ detail.remaining | decimaledAmount(detail.token.decimals) }}
            </div>
          </div>
          <div class="card" shadow="always">
            <div class="header">
              {{ $t('detail.Withdrawable') }}（
              <i v-if="!detail.imgShow">?</i>
              <img v-else :src="detail.imgUrl">
              {{ detail.token.symbol }}）
            </div>
            <div class="content">
              ～{{ detail.withdrawable | decimaledAmount(detail.token.decimals) }}
            </div>
          </div>
        </div>
        <div class="right card">
          <div class="header">
            <div class="title">
              {{ $t('detail.detail') }}
            </div>
            <div class="status">
              <stream-status
                :start-block="detail.startBlock"
                :current-block="blockNumber"
                :remaining="detail.remaining"
                :is-canceled="detail.isCanceled"
              />
            </div>
          </div>
          <div class="content">
            <div class="part1 block-info">
              <div class="item item1">
                <div class="label block">
                  {{ $t('detail.StartBlock') }}
                </div>
                <div class="value">
                  #{{ detail.startBlock }}
                </div>
              </div>
              <div class="item item2">
                <div class="label ratio">
                  {{ $t('detail.UnlockRatio') }}
                </div>
                <div class="value">
                  {{ detail.unlockRatio }}‰
                </div>
              </div>
              <div class="item item3">
                <div class="label lockNumber">
                  {{ $t('detail.UnlockK') }}
                </div>
                <div class="value">
                  {{ detail.kBlock }}
                </div>
              </div>
              <div class="item item4">
                <div class="label HalfLife">
                  {{ $t('nav.HalfLife') }}<i class="el-icon-warning-outline" @click="open" />
                </div>
                <div class="value">
                  {{ halfLife }}<span v-html="$t('Company')" />
                </div>
              </div>
            </div>
            <div class="part2 sender item">
              <div class="label sender">
                {{ $t('detail.Sender') }}
              </div>
              <div class="value">
                {{ detail.sender }}
              </div>
            </div>
            <div class="part3 recipent item">
              <div class="label recipent">
                {{ $t('detail.Recipent') }}
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
          {{ $t('detail.LastestActivity') }}
        </div>
        <el-table
          v-loading="loading"
          :data="pageData"
          class="table"
          :cell-style="cellStyle"
          :header-cell-style="cellStyle"
        >
          <el-table-column :label="$t('detail.Date')" min-width="120">
            <template slot-scope="scope">
              <span :title="scope.row.timestamp">{{
                scope.row.timestamp | date
              }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('detail.Event')" align="center" min-width="120">
            <template slot-scope="scope">
              <span :title="scope.row.event">{{ scope.row.event }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('detail.From')" align="center" min-width="120">
            <template slot-scope="scope">
              <span :title="scope.row.from">{{ scope.row.from | addr }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('detail.To')" align="center" min-width="120">
            <template slot-scope="scope">
              <span :title="scope.row.to">{{ scope.row.to | addr }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('detail.Txhash')" align="right">
            <template slot-scope="scope">
              <span><a :title="scope.row.txhash" target="_blank" :href="`https://kovan.etherscan.io/tx/${scope.row.txhash}`" style="color: inherit;">{{ scope.row.txhash | addr }}</a></span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="pagination"
          style="padding-top: 20px;"
          :current-page.sync="page"
          :page-size="limit"
          layout="prev, pager, next"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :title="$t('detail.Withdraw')"
      :visible.sync="withdrawDialogVisible"
      :width="isMobile ? '80%' : '30%'"
    >
      <div class="dialog-content">
        <!--        <div style="padding: 10px;">-->
        <!--          {{ $t('detail.TOTAL') }}: {{ withdrawable }} {{ detail.token.symbol }}-->
        <!--        </div>-->
        <el-form
          ref="withdrawForm"
          label-position="top"
          label-width="80px"
          :model="formWithdraw"
          :rules="withdrawRules"
          :status-icon="true"
          class="form"
        >
          <el-form-item :label="`${$t('detail.TOTAL')}： ${withdrawable} ${detail.token.symbol}`" prop="amount">
            <el-input v-model="formWithdraw.amount" placeholder="">
              <el-button slot="append" @click="maxAmount('withdraw')">
                {{ $t('detail.MAX') }}
              </el-button>
            </el-input>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="isWithdrawBtnDisabled" :loading="withdrawing" @click="doWithdraw">{{ $t('detail.Confirm') }}</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :title="$t('detail.Fund')"
      :visible.sync="fundDialogVisible"
      :width="isMobile ? '80%' : '30%'"
    >
      <div class="dialog-content">
        <!--        <div style="padding: 10px;">-->
        <!--          {{ $t('detail.TOTAL') }}: {{ currentTokenAmount }} {{ detail.token.symbol }}-->
        <!--        </div>-->
        <el-form
          ref="fundForm"
          label-position="top"
          label-width="80px"
          :model="formFund"
          :rules="fundRules"
          :status-icon="true"
          class="form"
        >
          <el-form-item :label="`${$t('detail.fund.amount')} ${$t('detail.TOTAL')}: ${currentTokenAmount } ${ detail.token.symbol}`" prop="amount">
            <div style="display: flex;">
              <el-input v-model="formFund.amount" placeholder="">
                <el-button slot="append" @click="maxAmount('fund')">
                  {{ $t('detail.MAX') }}
                </el-button>
              </el-input>
              <el-button v-show="showApprove" style="margin-left: 2px;" round @click="approve">
                {{ $t("home.Create.approve") }}
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="isFundBtnDisabled" :loading="funding" @click="doFund">{{ $t('detail.Confirm') }}</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :title="$t('detail.Cancel')"
      :visible.sync="cancelDialogVisible"
      :width="isMobile ? '80%' : '30%'"
    >
      <span>{{ $t('detail.ConfirmDo') }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="cancelling" :loading="cancelling" @click="doCancel">{{ $t('detail.Confirm') }}</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :title="'资金授权'"
      :visible.sync="tx.isDialogVisible"
      :width="isMobile ? '80%' : '30%'"
    >
      <div style="text-align: center;">
        <div style="margin-bottom:20px;">
          <i class="el-icon-loading" />
        </div>
        {{ tx.msg }}
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { STREAM_DETAIL } from '@/api/apollo/queries'
import { XHalfLifeContract, selectAbi } from '@/api/contract'
import { getProvider, provider } from '@/api/contract/ethers'
import metamask from '@/api/wallet/metamask'
import { ethers } from 'ethers'
import XHalfLifeABI from '@/api/contract/abis/XHalfLife'
import { mapGetters, mapState } from 'vuex'
import { isMobile, statusedList, decimalsNumber, isEth } from '@/utils/index'
import _ from 'lodash'

import { BigNumber } from 'bignumber.js'
import web3 from 'web3'
export default {
  name: 'Detail',
  data () {
    // withdraw
    const checkWithdrawAmount = async (rule, value, callback) => {
      const v = BigNumber(value)
      if (!v.isFinite()) {
        callback(new Error(this.$t('home.Create.should_be_a_number')))
        return
      }
      // 最小值限制
      if (v.lt(0.0001)) {
        callback(new Error(this.$t('home.Create.deposit_amount_is_too_small')))
        return
      }

      const max = this.withdrawable
      console.log('checkWithdrawAmount', value, max)
      if (BigNumber(max).lt(value)) { // !!! 直接使用value，否则使用Number转换后的会丢失精度
        callback(new Error(this.$t('home.Create.deposit_amount_is_too_big')))
        return
      }

      callback()
    }
    const withdrawRules = {
      amount: [
        { required: true, message: this.$t('detail.withdraw.require_amount_field'), trigger: 'change' },
        { validator: checkWithdrawAmount, message: '', trigger: 'change' }
      ]
    }

    // fund
    const checkFundAmount = async (rule, value, callback) => {
      const v = BigNumber(value)
      if (!v.isFinite()) {
        callback(new Error(this.$t('home.Create.should_be_a_number')))
        return
      }
      // 最小值限制
      if (v.lt(0.0001)) {
        callback(new Error(this.$t('home.Create.deposit_amount_is_too_small')))
        return
      }
      const max = this.tokenMaxAmountSpend
      if (BigNumber(max).lt(value)) { // !!! 直接使用value，否则使用Number转换后的会丢失精度
        callback(new Error(this.$t('home.Create.deposit_amount_is_too_big')))
        return
      }

      // 检查已授权
      if (!isEth(this.currentTokenInfo.id)) {
        const currentTokenApprovedAmount = await this.getTokenApprovedAmount(this.detail.token)
        this.currentTokenApprovedAmount = currentTokenApprovedAmount
        if (BigNumber(currentTokenApprovedAmount).lt(value)) {
          callback(new Error(this.$t('home.Create.approved_amount_is_too_small')))
          return
        }
      }

      callback()
    }
    const fundRules = {
      amount: [
        { required: true, message: this.$t('detail.fund.require_amount_field'), trigger: 'change' },
        { validator: checkFundAmount, message: '', trigger: 'change' }
      ]
    }

    return {
      id: 0,
      streamId: 0, // 同id
      page: 1,
      limit: 10,
      total: 0,
      pageData: [],
      halfLife: 0,
      http: !window.location.origin.includes('ethereum') ? 'https://static.xdefi.net/blockchains/kovan/' : 'https://static.xdefi.net/blockchains/ethereum/',

      detail: {
        token: {
          symbol: '',
          id: '',
          decimals: ''
        }
      },
      withdrawable: 0,
      currentTokenInfo: {},
      currentTokenAmount: 0,
      currentTokenApprovedAmount: 0,

      withdrawDialogVisible: false,
      fundDialogVisible: false,
      cancelDialogVisible: false,
      loading: false,
      withdrawing: false,
      funding: false,
      cancelling: false,
      isMobile: isMobile(),

      // 赎回
      withdrawRules,
      formWithdraw: {
        amount: undefined
      },

      // 追加
      fundRules,
      formFund: {
        amount: undefined
      },

      tx: {
        isDialogVisible: false,
        msg: this.$t('home.Create.waiting'),
        showDialog (tag = true) {
          this.isDialogVisible = tag
        },
        showMsg (msg) {
          this.msg = msg || 'Wating...'
        }
      }
    }
  },
  computed: {
    ...mapGetters(['isMetaMaskConnected', 'currentAccount', 'isMetaMaskNetworkRight']),
    ...mapState({
      blockNumber (state) {
        return state.blockNumber
      },
      detailCache (state) {
        return state.detailCache
      },
      total (state) {
        return Number(state.stats.count) || 0
      },
      account (state) {
        return state.metamask && state.metamask.account
      },
      isWithdrawBtnDisabled () {
        return this.withdrawing || !this.formWithdraw.amount || this.formWithdraw.amount <= 0 || BigNumber(this.formWithdraw.amount).gt(this.withdrawable)
      },
      isFundBtnDisabled () {
        return this.funding || this.showApprove || !this.formFund.amount || this.formFund.amount <= 0 || BigNumber(this.formFund.amount).gt(this.currentTokenAmount)
      },
      tokenMaxAmountSpend () {
        let amount = 0
        if (this.currentTokenInfo && this.currentTokenAmount && _.isFinite(Number(this.currentTokenAmount))) {
          if (isEth(this.currentTokenInfo.id)) {
            amount = BigNumber(this.currentTokenAmount).minus(0.01).toString() // TODO 可配置
          } else {
            amount = Number(this.currentTokenAmount)
          }
        }
        return amount
      }

    }),
    canWithDraw () {
      const yes = this.account && this.account === this.detail.recipient && this.detail.withdrawable > 0.0001 && !this.detail.isCanceled
      return yes
    },
    canFund () {
      const yes = this.account && this.account === this.detail.sender && !this.detail.isCanceled
      return yes
    },
    canCancel () {
      const yes = this.detail.cancelable && this.account && (this.account === this.detail.recipient || this.account === this.detail.sender) && !this.detail.isCanceled 
      return yes
    },

    showApprove () {
      let show = false
      if (this.isMetaMaskNetworkRight && this.isMetaMaskConnected && this.currentAccount && this.formFund.amount > 0) {
        show = Number(this.currentTokenApprovedAmount) === 0 || BigNumber(this.currentTokenApprovedAmount).lt(this.formFund.amount)
      }
      return show
    }
  },
  watch: {
    detailCache () {
      this.detail = { ...this.detail, ...this.detailCache[this.id] }
      this.total = this.detail.txs ? this.detail.txs.length : 0
      this.detail.txs && this.formData(this.detail.txs)
      this.show(this.detail)
      this.detail.txs && this.showImg(this.detail)
    },
    'detail.token.id' (newVal, oldVal) {
      if (newVal) {
        this.tokenBalance()
      }
    }
  },
  async mounted () {
    const id = this.$route.query && this.$route.query.id
    this.id = id
    this.streamId = id
    this.detail = { ...this.detail, ...this.detailCache[id] }
    this.total = this.detail.txs ? this.detail.txs.length : 0
    this.detail.txs && this.formData(this.detail.txs)
    this.$store.dispatch('refreshLatestBlockNumber')
    this.detail.txs && this.show(this.detail)
    if (this.detail.token) {
      this.currentTokenInfo = this.detail.token
    }

    // 请求最新
    await this.refresh()

    const tokenId = this.detail.token && this.detail.token.id
    if (tokenId) {
      if (isEth(tokenId)) {
        this.currentTokenApprovedAmount = await this.getTokenApprovedAmount(this.detail.token)
      }
    }
  },
  methods: {
    async refresh () {
      const streamId = this.id
      if (streamId) {
        await this.getDetail(streamId)
        await this.getStreamBalance(streamId)
      }
    },
    handleSizeChange (val) {
    },
    handleCurrentChange (val) {
      this.page = val
      this.formData(this.detail.txs)
    },
    formData (data) {
      const page = this.page
      const limit = this.limit
      const arr = []
      data.map((item, id) => {
        if (id >= (page - 1) * limit && id < page * limit) {
          arr.push(item)
        }
      })
      this.pageData = arr
    },
    show (detail) {
      const ratio = detail.unlockRatio

      const value = BigNumber(ratio).shiftedBy(0 - 3).toNumber()
      const time = parseInt(((detail.kBlock * 0.69) / (-Math.log(1 - value))) * 13.1 / 43200 * 100) / 100
      this.halfLife = time
    },
    showImg (detail) {
      let url
      if (detail.token.id === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
        url = this.http + 'info/logo.png'
      } else {
        url = this.http + 'assets/' + web3.utils.toChecksumAddress(detail.token.id) + '/logo.png'
      }

      const img = new Image()
      img.src = url
      this.detail = Object.assign({}, detail, {
        imgUrl: '',
        imgShow: false
      })

      img.onload = () => {
        this.detail = Object.assign({}, detail, {
          imgShow: true,
          imgUrl: url
        })
      }
    },
    open () {
      this.$alert(this.$t('openTips'), {
        showConfirmButton: false,
        dangerouslyUseHTMLString: true,
        callback: (action) => {

        }
      })
    },

    async tokenBalance () {
      console.log('tokenBalance', this.detail.token)
      const provider = await getProvider()
      const signer = await provider.getSigner()
      try {
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
      } catch (e) {
        console.error('tokenBalance error', e)
        this.currentTokenAmount = 0
      }
    },
    async getTokenApprovedAmount () { // 获取已授权额度
      const tokenInfo = this.detail.token
      try {
        const tokenAddress = tokenInfo.id
        // 获得provider
        const provider = await getProvider()
        const signer = provider.getSigner()

        // this.tx.showMsg('检查授权额度')
        const tokenContract = new ethers.Contract(tokenAddress, selectAbi(_.toLower(tokenInfo.symbol)), signer)
        const allowance = await tokenContract.allowance(this.currentAccount, process.env.XHALFLIFE_CONTRACT_ADDTRESS)
        const amount = decimalsNumber(allowance, tokenInfo.decimals)

        // side effect
        this.currentTokenApprovedAmount = amount
        //  主动触发一次验证
        return amount
      } catch (e) {
        console.error('getTokenApprovedAmount', e)
        return 0
      }
    },
    async getDetail (id) {
      const ret = await this.$apollo.query({ query: STREAM_DETAIL, variables: { id: Number(id) } })
      const detail = ret.data.streams && statusedList(ret.data.streams)[0]
      this.$store.commit('updateSteamDetail', detail)
      // side effect
      this.currentTokenInfo = detail.token
    },
    async getStreamBalance (id) {
      try {
        const ret = await XHalfLifeContract.balanceOf(id)
        this.withdrawable = ethers.utils.formatUnits(ret.withdrawable, this.detail.token.decimals)
        this.$store.commit('updateBalanceByStreamId', { key: id, value: ret })
      } catch (e) {
        console.error(e)
      }
    },

    async doWithdraw () {
      this.$refs.withdrawForm.validate(async (valid) => {
        if (!valid) {
          this.$message({
            message: this.$t('home.checkData'),
            type: 'warning'
          })
          return
        }
        this._doWithdraw()
      })
    },
    async  _doWithdraw () {
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

        this.$message({
          message: this.$t('detail.WithdrawSuccess'),
          type: 'success'
        })
        this.withdrawing = false
        this.withdrawDialogVisible = false
        this.refresh()
      } catch (e) {
        console.error('WithdrawFailed', e)
        this.$message({
          message: this.$t('detail.WithdrawFailed'), // e.message,
          type: 'warning'
        })
        this.withdrawing = false
        this.withdrawDialogVisible = false
        this.refresh()
      }
    },

    async doFund () {
      this.$refs.fundForm.validate(async (valid) => {
        if (!valid) {
          this.$message({
            message: this.$t('home.checkData'),
            type: 'warning'
          })
          return
        }
        this._doWithdraw()
      })
    },

    async _doFund () {
      this.funding = true
      try {
        // 获得provider
        const provider = await getProvider()
        const signer = provider.getSigner()
        const contract = new ethers.Contract(process.env.XHALFLIFE_CONTRACT_ADDTRESS, XHalfLifeABI, signer)
        const tokenContract = new ethers.Contract(this.detail.token.id, selectAbi(this.detail.token.symbol), signer)

        // 表单数据
        this.formFund.streamId = this.id
        const { streamId } = this.formFund
        const decimaledAmount = ethers.utils.parseUnits(this.formFund.amount, this.detail.token.decimals).toString()

        let tx
        if (!isEth(this.detail.token.id)) {
          tx = await contract.fundStream(streamId, decimaledAmount.toString())
        } else {
          tx = await contract.fundStream(streamId, decimaledAmount.toString(), { value: decimaledAmount.toString() })
        }
        const txResult = await tx.wait()
        this.$message({
          message: this.$t('detail.FundSuccess'),
          type: 'success'
        })
        this.funding = false
        this.fundDialogVisible = false
        this.refresh()
      } catch (e) {
        console.error('FundFailed', e)

        this.$message({
          message: this.$t('detail.FundFailed'), // e.message,
          type: 'warning'
        })
        this.funding = false
        this.fundDialogVisible = false
        this.refresh()
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
            message: this.$t('detail.Missing'),
            type: 'warning'
          })
          return
        }

        // 提交
        const tx = await contract.cancelStream(streamId)
        const txResult = await tx.wait()

        this.$message({
          message: this.$t('detail.CancelSuccess'),
          type: 'success'
        })
        this.cancelling = false
        this.cancelDialogVisible = false
        this.refresh()
      } catch (e) {
        console.error('CancelFailed', e)
        this.$message({
          message: this.$t('detail.CancelFailed'), // e.message,
          type: 'warning'
        })
        this.cancelling = false
        this.cancelDialogVisible = false
        this.refresh()
      }
    },
    maxAmount (type) {
      if (type === 'fund') {
        this.formFund.amount = this.tokenMaxAmountSpend // 区分eth和其他币种
      } else if (type === 'withdraw') { // 不区分eth
        this.formWithdraw.amount = ethers.utils.formatUnits(this.detail.withdrawable, this.detail.token.decimals)
      }
    },
    cellStyle (obj) {
      return 'background-color:#272958;border-bottom-color:#2E2F5C;color:#7E7F9C;'
    },

    async approve () {
      try {
        this.tx.showDialog()
        this.tx.showMsg(this.$t('home.Create.approve_start'))
        const formData = this.formFund
        const tokenInfo = this.currentTokenInfo

        const tokenDecimals = tokenInfo.decimals
        const decimalsAmount = ethers.utils.parseUnits(formData.amount, tokenDecimals)
        const tokenAddress = tokenInfo.id

        // const accounts = await metamask.connectMetaMask()
        // console.log('connect metamask', accounts)

        // 非 ETH
        if (isEth(tokenAddress)) {
          // 获得provider
          const provider = await getProvider()
          const signer = provider.getSigner()
          const tokenContract = new ethers.Contract(tokenAddress, selectAbi(tokenInfo.id.toLowerCase()), signer)

          const approveValue = decimalsAmount
          const approveTx = await tokenContract.approve(process.env.XHALFLIFE_CONTRACT_ADDTRESS, approveValue)
          const approveResult = await approveTx.wait()
          console.log('approveResult', approveResult)
          this.tx.showMsg(this.$t('home.Create.approve_success'))
          this.tx.showDialog(false)

          // 刷新
          console.log(' refresh getTokenApprovedAmount')
          const amount = await this.getTokenApprovedAmount(tokenInfo)
          console.log(' refresh getTokenApprovedAmount result', amount)
          this.$refs.fundForm.validateField('amount')
          // this.checkSubmitBtn()
        }
      } catch (e) {
        console.log('approve_failed', e)
        this.tx.showMsg(this.$t('home.Create.approve_failed'))
        setTimeout(() => {
          this.tx.showDialog(false)
        }, 1000)
        this.$message({
          message: this.$t('home.Approve.Failure'), // e.message + e.code,
          type: 'warning'
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "~/pages/home/index.scss";
@import "./index.scss";
</style>
