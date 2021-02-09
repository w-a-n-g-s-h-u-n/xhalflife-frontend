<template>

  <div class="main">
    <div class="module mainContainer">
      <div class="breadcrumb">
        <NuxtLink to="/" class="breadcrumbLink">{{$t('nav.HalfLife')}}</NuxtLink> <span><i class="el-icon-right" /></span> {{$t('detail.detail')}}
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
            {{$t('detail.Fund')}}
          </el-button>
          <el-button
            v-if="canWithDraw"
            type="primary"
            class="action-withdraw"
            @click="withdrawDialogVisible = true"
            :size="isMobile ? 'small' : 'medium'"
          >
            {{$t('detail.WithDraw')}}
          </el-button>
          <el-button
            v-if="canCancel"
            type="text"
            class="action-cancel"
            @click="cancelDialogVisible = true"
            :size="isMobile ? 'small' : 'medium'"
          >
            {{$t('detail.Cancel')}}
          </el-button>
        </div>
      </div>
      <div class="detail-cards">
        <div class="left">
          <div class="card" shadow="always">
            <div class="header">{{$t('detail.Remaining')}}（
            <i v-if="!detail.imgShow">?</i>
            <img v-else :src="detail.imgUrl" />
            {{detail.token.symbol}}）</div>
            <div class="content">～{{ detail.remaining | decimaledAmount(detail.token.decimals)}}</div>
          </div>
          <div class="card" shadow="always">
            <div class="header">{{$t('detail.Withdrawable')}}（
            <i v-if="!detail.imgShow">?</i>
            <img v-else :src="detail.imgUrl" />
            {{detail.token.symbol}}）</div>
            <div class="content">
              ～{{ detail.withdrawable | decimaledAmount(detail.token.decimals)}}
            </div>
          </div>
        </div>
        <div class="right card">
          <div class="header">
            <div class="title">
              {{$t('detail.detail')}}
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
                <div class="label block">{{$t('detail.StartBlock')}}</div>
                <div class="value">#{{ detail.startBlock }}</div>
              </div>
              <div class="item item2">
                <div class="label ratio">{{$t('detail.UnlockRatio')}}</div>
                <div class="value">{{ detail.unlockRatio }}‰</div>
              </div>
              <div class="item item3">
                <div class="label lockNumber">{{$t('detail.UnlockK')}}</div>
                <div class="value">
                  {{ detail.kBlock }}
                </div>
              </div>
              <div class="item item4">
                <div class="label HalfLife">{{$t('nav.HalfLife')}}<i class="el-icon-warning-outline" @click="open"></i></div>
                <div class="value">
                  {{halfLife}}<span v-html="$t('Company')"></span>
                </div>
              </div>
            </div>
            <div class="part2 sender item">
              <div class="label sender">{{$t('detail.Sender')}}</div>
              <div class="value">
                {{ detail.sender }}
              </div>
            </div>
            <div class="part3 recipent item">
              <div class="label recipent">{{$t('detail.Recipent')}}</div>
              <div class="value">
                {{ detail.recipient }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card last-activity">
        <div class="header">
          {{$t('detail.LastestActivity')}}
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
          <el-table-column :label="$t('detail.Event')" align='center' min-width="120">
            <template slot-scope="scope">
              <span :title="scope.row.event">{{ scope.row.event }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('detail.From')" align='center' min-width="120">
            <template slot-scope="scope">
              <span :title="scope.row.from">{{ scope.row.from | addr }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('detail.To')" align='center' min-width="120">
            <template slot-scope="scope">
              <span :title="scope.row.to">{{ scope.row.to | addr }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('detail.Txhash')" align="right">
            <template slot-scope="scope">
              <span><a :title="scope.row.txhash" target="_blank" :href="`https://kovan.etherscan.io/tx/${scope.row.txhash}`" style='color: inherit;'>{{ scope.row.txhash | addr }}</a></span>
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
      :title="$t('detail.Withdraw')"
      :visible.sync="withdrawDialogVisible"
      :width="isMobile ? '80%' : '30%'"
    >
      <div class="dialog-content">
        <div style="padding: 10px;">
          {{$t('detail.TOTAL')}}: {{ withdrawable }} {{detail.token.symbol}}
        </div>
        <el-input placeholder="" v-model="formWithdraw.amount">
          <el-button slot="append" @click="maxAmount('withdraw')">{{$t('detail.MAX')}}</el-button>
        </el-input>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doWithdraw" :disabled="withdrawing" :loading="withdrawing">{{$t('detail.Confirm')}}</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="$t('detail.Fund')"
      :visible.sync="fundDialogVisible"
      :width="isMobile ? '80%' : '30%'"
    >
      <div class="dialog-content">
        <div style="padding: 10px;">
          {{$t('detail.TOTAL')}}: {{ currentTokenAmount }} {{detail.token.symbol}}
        </div>
        <el-input placeholder="" v-model="formFund.amount">
          <el-button slot="append" @click="maxAmount('fund')">{{$t('detail.MAX')}}</el-button>
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doFund" :disabled="funding" :loading="funding">{{$t('detail.Confirm')}}</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="$t('detail.Cancel')"
      :visible.sync="cancelDialogVisible"
      :width="isMobile ? '80%' : '30%'"
    >
      <span>{{$t('detail.ConfirmDo')}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doCancel" :disabled="cancelling" :loading="cancelling">{{$t('detail.Confirm')}}</el-button>
      </span>
    </el-dialog>
  </div>

</template>
<script>
import { STREAM_DETAIL } from '@/api/apollo/queries'
import { XHalfLifeContract } from '@/api/contract'
import { getProvider, provider } from '@/api/contract/ethers'
import metamask from '@/api/wallet/metamask'
import { ethers } from 'ethers'
import XHalfLifeABI from '@/api/contract/abis/XHalfLife'
import { mapState } from 'vuex'
import { isMobile, statusedList, decimalsNumber } from '@/utils/index'
import { selectAbi } from '@/api/contract'
import { BigNumber } from 'bignumber.js'
import web3 from 'web3'
export default {
  name: 'Detail',
  data () {
    return {
      id: 0,
      page: 1,
      limit: 10,
      total:0,
      pageData:[],
      halfLife: 0,
      http:window.location.origin.indexOf('ethereum')<0?'https://static.xdefi.net/blockchains/kovan/':'https://static.xdefi.net/blockchains/ethereum/',

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
      total (state) {
        return Number(state.stats.count) || 0
      },
      account (state) {
        return state.metamask && state.metamask.account
      }

    }),
    canWithDraw () {
      const yes = this.account && this.account === this.detail.recipient && this.detail.withdrawable > 0.0001
      return yes
    },
    canFund () {
      const yes = this.account && this.account === this.detail.sender
      return yes
    },
    canCancel () {
      const yes = this.account && (this.account === this.detail.recipient || this.account === this.detail.sender)
      return yes
    }
  },
  watch: {
    detailCache () {
      this.detail = { ...this.detail, ...this.detailCache[this.id] }
      this.total = this.detail.txs?this.detail.txs.length:0
      this.detail.txs&&this.formData(this.detail.txs)
      this.show(this.detail)
      this.detail.txs&&this.showImg(this.detail)
    },
    'detail.token.id' (newVal, oldVal) {
      if (newVal) {
        this.tokenBalance()
      }
    }
  },
  mounted () {
    const id = this.$route.query && this.$route.query.id
    this.id = id
    this.detail = { ...this.detail, ...this.detailCache[id] }
    this.total = this.detail.txs?this.detail.txs.length:0
    this.detail.txs&&this.formData(this.detail.txs)
    this.$store.dispatch('refreshLatestBlockNumber')
    this.detail.txs && this.show(this.detail)
    // 请求最新
    if (id) {
      this.getDetail(id)
      this.getStreamBalance(id)
    }
  },
  methods: {
    handleSizeChange (val) {
    },
    handleCurrentChange (val) {
      this.page = val
      this.formData(this.detail.txs)
    },
    formData(data){

      const page = this.page
      const limit = this.limit
      let arr = []
      data.map((item,id)=>{
        if(id>=(page-1)*limit&&id<page*limit){
          arr.push(item)
        }
      })
      this.pageData = arr;
    },
    show (detail) {
      const ratio = detail.unlockRatio

      const value = BigNumber(ratio).shiftedBy(0 - 3).toNumber()
      const time = parseInt(((detail.kBlock * 0.69) / (-Math.log(1 - value))) * 13.1 / 43200 * 100) / 100
      this.halfLife = time



    },
    showImg(detail){
      let url
      if(detail.token.id === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'){
        url = this.http +'info/logo.png'
      }else{
        url = this.http +'assets/'+ web3.utils.toChecksumAddress(detail.token.id) + '/logo.png';

      }

      const img = new Image();
      img.src= url;
      this.detail = Object.assign({},detail,{
          imgUrl:'',
          imgShow:false
        })

      img.onload=()=>{

        this.detail = Object.assign({},detail,{
          imgShow:true,
          imgUrl:url
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
      try {
        const ret = await XHalfLifeContract.balanceOf(id)
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
          message: this.$t('detail.Invalid'),
          type: 'warning'
        })
        return
      }
      if (!this.formWithdraw.amount > this.detail.withdrawable) {
        this.$message({
          message: this.$t('detail.Invalid'),
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

        this.$message({
          message: this.$t('detail.WithdrawSuccess'),
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
          message: this.$t('detail.NumMin'),
          type: 'warning'
        })
        return
      }
      if (!this.formFund.amount > this.detail.withdrawable) {
        this.$message({
          message: this.$t('detail.NumMax'),
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
            message: this.$t('home.Need'),
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
          const depositAmountBig = ethers.BigNumber.from(decimaledAmount)
          if (depositAmountBig.lte(allowance)) {
          } else {
            // approve
            const approveValue = depositAmountBig.sub(allowance)
            const approveTx = await tokenContract.approve(process.env.XHALFLIFE_CONTRACT_ADDTRESS, approveValue)
            const approveResult = await approveTx.wait()
          }
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
