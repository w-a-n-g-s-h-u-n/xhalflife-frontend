<template>
  <div class="wrap">
    <el-form
      ref="createForm"
      label-position="top"
      label-width="80px"
      :model="formData"
      :rules="rules"
      :status-icon="true"
      class="form"
    >
      <el-form-item :label="$t('home.Token')" prop="token">
        <el-autocomplete
          v-model="formData.token"
          size="medium"
          :fetch-suggestions="querySearch"
          :placeholder="$t('home.TokenPlaceholder')"
          style="width: 100%;"
          @select="onSelectToken"
        />
      </el-form-item>
      <el-form-item error="" :label="`${$t('home.Much')} (${$t('home.available')}: ${currentTokenAmount} ${currentTokenInfo && currentTokenInfo.symbol })`" prop="depositAmount">
        <div style="display: flex;">
          <el-input v-model="formData.depositAmount">
            <span slot="suffix" class="symbol">{{ currentTokenInfo && currentTokenInfo.symbol }}</span>
            <el-button slot="append" class="maxButton" @click="maxAmount">
              MAX
            </el-button>
          </el-input>
          <el-button v-show="showApprove" style="margin-left: 2px;" round @click="approve">
            {{ $t("home.Create.approve") }}
          </el-button>
        </div>
      </el-form-item>
      <el-form-item :label="$t('home.Address')" prop="recipient">
        <el-input v-model.trim="formData.recipient" />
      </el-form-item>

      <el-row :gutter="15" class="newStyle">
        <el-col :span="isMobile ? 24 : 9">
          <el-form-item class="input-style-2" prop="startBlock">
            <span slot="label">{{ $t('home.Should') }}<a :href="$t('homeLink')"><i class="el-icon-warning-outline" /></a></span>
            <el-input v-model.number="formData.startBlock" placeholder="" />
          </el-form-item>
        </el-col>
        <el-col :span="isMobile ? 24 : 8">
          <el-form-item prop="kBlock">
            <span slot="label">{{ $t('home.Block') }}<a :href="$t('homeLink')"><i class="el-icon-warning-outline" /></a></span>
            <el-input v-model.number="formData.kBlock" placeholder="" />
          </el-form-item>
        </el-col>
        <el-col :span="isMobile ? 24 : 7">
          <el-form-item prop="unlockRatio">
            <span slot="label">{{ $t('home.Ratio') }}<a :href="$t('homeLink')"><i class="el-icon-warning-outline" /></a></span>
            <el-input v-model.number="formData.unlockRatio" placeholder="">
              <template slot="append">
                ‰
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="actions">
      <el-button
        v-if="isMetaMaskConnected"
        :type="isMetaMaskNetworkRight?'primary':'danger'"
        round
        class="start-btn btn"
        :disabled="!isSubmitBtnEnabled || !isMetaMaskNetworkRight"
        @click="createStream"
      >
        {{ submitLabel }}
      </el-button>
      <el-button v-else type="primary" round class="start-btn btn" @click="connectWallwet">
        {{ $t('login.Connect') }}
      </el-button>

      <!--      <el-button>-->
      <!--        {{ isMetaMaskConnected }} {{ currentAccount }} {{ isSubmitBtnEnabled }}-->
      <!--      </el-button>-->
    </div>
    <p class="tips">
      {{ $t('tips')[0] }}<a href="https://etherscan.io/blocks" target="_blank">"{{ $t('tips')[1] }}"</a>{{ $t('tips')[2] }} {{ $t('currentBlock') }}:{{ blockNumber }}
    </p>

    <el-dialog
      :title="'创建流支付'"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
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
import { getProvider, provider } from '@/api/contract/ethers'
import metamask from '@/api/wallet/metamask'
import { SUPPORT_TOKENS } from '@/api/apollo/queries'
import { ethers } from 'ethers'
import XHalfLifeABI from '@/api/contract/abis/XHalfLife.json'
import { isMobile } from '@/utils/index'
import { mapState, mapActions, mapGetters } from 'vuex'
import { selectAbi } from '@/api/contract'
import { decimalsNumber } from '@/utils'
import _ from 'lodash'
import { BigNumber } from 'bignumber.js'
import { CHAIN_CONFIG } from '@/config'


export default {
  name: 'CreateStreamForm',
  props: ['refresh'],
  data () {
    const checkToken = async (rule, value, callback) => {
      if (!(this.currentTokenInfo && this.currentTokenInfo.id)) {
        callback(new Error(this.$t('home.Create.check_token')))
        return
      }
      callback()
    }
    const checkRecipent = async (rule, value, callback) => {
      if (!ethers.utils.isAddress(value)) {
        callback(new Error(this.$t('home.Create.should_be_an_address')))
        return
      }
      const currentAccount = await metamask.getAccountsByMetaMask()
      if (value === ethers.utils.getAddress(currentAccount[0])) {
        callback(new Error(this.$t('home.Create.recipentCantBeCurrentUser')))
        return
      }
      callback()
    }
    const checkDepositAmount = async (rule, value, callback) => {
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
      if (!this.isEth(this.currentTokenInfo.id)) {
        const currentTokenApprovedAmount = await this.getTokenApprovedAmount(this.currentTokenInfo)
        this.currentTokenApprovedAmount = currentTokenApprovedAmount
        if (BigNumber(currentTokenApprovedAmount).lt(value)) {
          callback(new Error(this.$t('home.Create.approved_amount_is_too_small')))
          return
        }
      }

      callback()
    }
    const checkBlockNumber = async (rule, value, callback) => {
      const v = BigNumber(value)
      if (!v.isFinite()) {
        callback(new Error(this.$t('home.Create.should_be_a_number')))
        return
      }
      // 获取最新区块
      const latestBlockNumber = await this.refreshLatestBlockNumber()

      // 可能由于网络等问题没获取到的情况 暂忽略 TODO
      if (latestBlockNumber) {
        const a = BigNumber(latestBlockNumber)

        if (!(v.isGreaterThan(a))) {
          // callback(new Error(this.$t('block_number_is_too_small')))
          this.formData.startBlock = a.plus(10).toNumber()
          callback()
        }
      }
      callback()
    }
    const checkKBlock = async (rule, value, callback) => {
      const v = BigNumber(value)
      if (!v.isFinite()) {
        callback(new Error(this.$t('home.Create.should_be_a_number')))
        return
      }
      if (!(v.gt(0))) {
        callback(new Error(this.$t('home.Create.block_number_is_too_small')))
        return
      }
      callback()
    }
    const checkUnlockRatio = async (rule, value, callback) => {
      const v = BigNumber(value)
      if (!v.isFinite()) {
        callback(new Error(this.$t('home.Create.should_be_a_number')))
        return
      }
      if (v.lt(1) || v.gt(1000)) {
        callback(new Error(this.$t('home.Create.unlock_ratio_should_be_between_1_1000')))
        return
      }
      callback()
    }
    return {
      tokenOptions: [],
      tokenMap: {},
      currentTokenInfo: {},
      currentTokenAmount: 0,
      currentTokenApprovedAmount: 0,

      buttonState: 'start',
      buttonDisable: false,
      formData: {
        token: '',
        recipient: '',
        depositAmount: undefined,
        startBlock: 0, // 22096060
        kBlock: 40,
        unlockRatio: 1 // '1000000000000000'
      },
      isMobile: isMobile(),
      balances: [],
      rules: {
        token: [
          { required: true, message: this.$t('home.token'), trigger: 'change' },
          { validator: checkToken, message: '', trigger: 'change' }
        ],
        recipient: [
          { required: true, message: this.$t('home.recipient'), trigger: 'change' },
          { validator: checkRecipent, message: '', trigger: 'change' }
        ],
        depositAmount: [
          { required: true, message: this.$t('home.depositAmount'), trigger: 'change' },
          { validator: checkDepositAmount, message: '', trigger: 'change' }
        ],
        startBlock: [
          { required: true, message: this.$t('home.startBlock'), trigger: 'change' },
          { type: 'number', message: this.$t('home.Create.should_be_a_number') },
          { validator: checkBlockNumber, message: '' }
        ],
        kBlock: [
          { required: true, message: this.$t('home.kBlock'), trigger: 'change' },
          { type: 'number', message: this.$t('home.Create.should_be_a_number') },
          { validator: checkKBlock, message: '' }

        ],
        unlockRatio: [
          { required: true, message: this.$t('home.unlockRatio'), trigger: 'change' },
          { type: 'number', message: this.$t('home.Create.should_be_a_number') },
          { validator: checkUnlockRatio, message: '' }
        ]
      },
      isSubmitBtnEnabled: false,
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
  async mounted () {
    this.initBlockNumber()
  },
  computed: {
    ...mapGetters(['isMetaMaskConnected', 'currentAccount', 'isMetaMaskNetworkRight']),
    ...mapState({
      chainId(state) {
        return state.metamask.chainId
      },
      blockNumber (state) {
        return state.blockNumber
      },
      xdexBalance (state) {
        return state.metamask && state.metamask.xdexBalance
      },
      tokenMaxAmountSpend () {
        let amount = 0
        if (this.currentTokenInfo && this.currentTokenAmount && _.isFinite(Number(this.currentTokenAmount))) {
          if (this.isEth(this.currentTokenInfo.id)) {
            amount = BigNumber(this.currentTokenAmount).minus(0.01).toString() // TODO 可配置
          } else {
            amount = Number(this.currentTokenAmount)
          }
        }
        return amount
      }
    }),
    showApprove () {
      let show = false
      if (this.isMetaMaskNetworkRight && this.isMetaMaskConnected && this.currentAccount && this.formData.depositAmount > 0) {
        show = Number(this.currentTokenApprovedAmount) === 0 || BigNumber(this.currentTokenApprovedAmount).lt(this.formData.depositAmount)
      }
      return show
    },
    submitLabel () {
      let label = 'Start'
      if (!this.isMetaMaskNetworkRight) {
        label = this.$t('net_work_error')
      }
      return label
    }
  },
  watch: {
    async 'currentTokenInfo' (newVal, oldVal) {
      const tokenId = this.currentTokenInfo.id
      if (tokenId) {
        if (this.isMetaMaskNetworkRight && this.isMetaMaskConnected && this.currentAccount) {
          this.currentTokenAmount = await this.updateTokenBalance(this.currentTokenInfo)
          if (!this.isEth(tokenId)) {
            this.currentTokenApprovedAmount = await this.getTokenApprovedAmount(this.currentTokenInfo)
          }
        }
      }
      this.$refs.createForm.validateField('token')
    },
    formData: {
      async handler (val, oldVal) {
        this.checkSubmitBtn()
      },
      deep: true
    }
  },
  async created () {
    this.fetchSupportToken()
  },
  methods: {
    ...mapActions(['refreshLatestBlockNumber', 'connectWallwet']),
    async querySearch (queryString, cb) {
      console.log('querySearch queryString', queryString)
      let tokens = this.tokenOptions
      if (queryString) {
        cb([]) // 关闭建议框
        if (ethers.utils.isAddress(queryString)) { //  如果是一个地址，并符合要求，则自动选中
          console.log('querySearch queryString isAddress', queryString)

          const provider = await getProvider()
          const signer = provider.getSigner()
          const tokenContract = new ethers.Contract(queryString, selectAbi(queryString), signer)
          try {
            const name = await tokenContract.name()
            const symbol = await tokenContract.symbol()
            const balanceOf = await tokenContract.balanceOf(this.currentAccount)
            const decimals = await tokenContract.decimals()
            this.currentTokenAmount = decimalsNumber(balanceOf, decimals)
            tokens = {
              value: symbol,
              id: queryString,
              address: queryString,
              name,
              symbol,
              decimals
            }
            this.currentTokenInfo = tokens
          } catch (e) {
            console.log('get token info error', queryString, e)
            this.$message({
              message: this.$t('home.checkAddress'),
              type: 'warning'
            })
          }
        } else if (this.tokenMap[_.toLower(queryString)]) {
          this.currentTokenInfo = this.tokenMap[_.toLower(queryString)]
        } else {
          this.currentTokenInfo = {} // 触发验证
          // this.$message({
          //   message: this.$t('home.checkAddress'),
          //   type: 'warning'
          // })
        }
      } else {
        cb(tokens)
      }
    },
    async updateTokenBalance (tokenInfo) {
      try {
        const provider = await getProvider()
        const signer = provider.getSigner()
        const tokenAddress = tokenInfo.id
        let tokenAmount = 0
        if (this.isEth(tokenAddress)) {
          const balance = await signer.getBalance()
          tokenAmount = ethers.utils.formatEther(balance)
        } else {
          const tokenContract = new ethers.Contract(tokenAddress, selectAbi(_.toLower(tokenInfo.symbol)), signer)
          const balanceOf = await tokenContract.balanceOf(this.currentAccount)
          tokenAmount = decimalsNumber(balanceOf, tokenInfo.decimals)
        }
        return tokenAmount
      } catch (e) {
        console.error('updateTokenBalance error', e)
        this.$message({
          message: e.message,
          type: 'warning'
        })
      }
    },
    async getTokenApprovedAmount (tokenInfo) { // 获取已授权额度
      try {
        const tokenAddress = tokenInfo.id
        // 获得provider
        const provider = await getProvider()
        const signer = provider.getSigner()

        const configs = CHAIN_CONFIG[this.chainId]

        console.log(configs);

        // this.tx.showMsg('检查授权额度')
        const tokenContract = new ethers.Contract(tokenAddress, selectAbi(_.toLower(tokenInfo.symbol)), signer)
        const allowance = await tokenContract.allowance(this.currentAccount, configs.addresses.xHalfLife)
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
    async initBlockNumber () {
      const blockNumber = await this.refreshLatestBlockNumber()
      // this.blockNumber = blockNumber
      this.formData.startBlock = blockNumber + 10
    },
    onSelectToken (item) {
      this.currentTokenInfo = item
    },
    maxAmount () {
      this.formData.depositAmount = this.tokenMaxAmountSpend && this.tokenMaxAmountSpend.toString()
    },
    async fetchSupportToken () {
      const tokenData = await this.$apollo.query({ query: SUPPORT_TOKENS })
      const tokenList = tokenData.data.tokens
      /* [
        {
          decimals: "18"
          id: "0x5c0c06c540f6182de0828af99520d6a71f796370"
          name: "Graph Token"
          symbol: "GRT"
          __typename: "Token"
        }
      ]
      */
      this.tokenOptions = tokenList.map(token => ({
        ...token,
        value: token.symbol,
        address: token.id
      }))
      this.tokenMap = _.reduce(tokenList, (ret, item) => {
        ret[_.toLower(item.symbol)] = item
        return ret
      }, {})

      this.formData.token = this.tokenOptions[0].symbol
      this.currentTokenInfo = this.tokenOptions[0]
    },
    async checkSubmitBtn () {
      console.log('checkSubmitBtn', this.formData)

      // 0. 钱包已连接
      // 1. 所有required字段非空
      // 2. 所有非空字段通过校验
      const formData = this.formData
      if (!(this.isMetaMaskConnected && this.currentAccount)) {
        this.isSubmitBtnEnabled = false
        return
      }

      if (formData.token && formData.recipient && formData.depositAmount &&
        formData.startBlock &&
        formData.kBlock && formData.unlockRatio) {
        try {
          const valid = await this.$refs.createForm.validate()
          console.log('formData validate', valid, formData)
          if (valid) {
            this.isSubmitBtnEnabled = true
            return
          } else {
            this.isSubmitBtnEnabled = false
            return
          }
        } catch (e) {
          console.error('refs.createForm.validate', e)
        }
      }
      this.isSubmitBtnEnabled = false
    },
    isEth (address) {
      return address === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
    },
    async approve () {
      try {
        this.tx.showDialog()
        this.tx.showMsg(this.$t('home.Create.approve_start'))
        const formData = this.formData
        const { depositAmount } = this.formData

        const tokenInfo = this.currentTokenInfo

        const tokenDecimals = tokenInfo.decimals
        const decimalsAmount = ethers.utils.parseUnits(depositAmount, tokenDecimals)
        const tokenAddress = tokenInfo.id

        // const accounts = await metamask.connectMetaMask()
        // console.log('connect metamask', accounts)

        // 非 ETH
        if (!this.isEth(tokenAddress)) {
          // 获得provider
          const provider = await getProvider()
          const signer = provider.getSigner()
          const configs = CHAIN_CONFIG[this.chainId]
          const tokenContract = new ethers.Contract(tokenAddress, selectAbi(this.formData.token.toLowerCase()), signer)

          const approveValue = decimalsAmount
          const approveTx = await tokenContract.approve(configs.addresses.xHalfLife, approveValue)
          const approveResult = await approveTx.wait()
          console.log('approveResult', approveResult)
          this.tx.showMsg(this.$t('home.Create.approve_success'))
          this.tx.showDialog(false)

          // 刷新
          console.log(' refresh getTokenApprovedAmount')
          const amount = await this.getTokenApprovedAmount(tokenInfo)
          console.log(' refresh getTokenApprovedAmount result', amount)
          this.$refs.createForm.validateField('depositAmount')
          this.checkSubmitBtn()
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
    },
    createStream () {
      if (!this.isSubmitBtnEnabled) { return }
      this.$refs.createForm.validate(async (valid) => {
        if (!valid) {
          this.$message({
            message: this.$t('home.checkData'),
            type: 'warning'
          })
          return
        }
        const tokenInfo = this.currentTokenInfo

        const formData = { ...this.formData }
        const tokenDecimals = tokenInfo.decimals
        const tokenAddress = tokenInfo.id
        try {
          this.tx.showDialog()
          // this.tx.showMsg('请求连接钱包')
          // const accounts = await metamask.connectMetaMask()
          const { recipient, depositAmount, startBlock, kBlock, unlockRatio } = this.formData
          const decimalsAmount = ethers.utils.parseUnits(depositAmount, tokenDecimals)
          const decimalsRatio = unlockRatio

          // 获得provider
          const provider = await getProvider()
          const signer = provider.getSigner()
          const configs = CHAIN_CONFIG[this.chainId]
          const contract = new ethers.Contract(configs.addresses.xHalfLife, configs.abis.halflife, signer)

          let tx
          if (this.isEth(tokenAddress)) {
            this.tx.showMsg(this.$t('home.checkData'))
            tx = await contract.createEtherStream(recipient, startBlock, kBlock, decimalsRatio, true, { value: decimalsAmount })
          } else {
            this.tx.showMsg(this.$t('home.Create.create_stream_start'))
            tx = await contract.createStream(tokenAddress, recipient, decimalsAmount.toString(), startBlock, kBlock, decimalsRatio, true)
            console.log('tx', tx)
          }

          const createStreamResult = await tx.wait()
          console.log('createStreamResult', createStreamResult)
          this.tx.showMsg(this.$t('home.Create.create_stream_sucess'))
          this.tx.showDialog(false)

          this.$message({
            message: this.$t('home.Create'),
            type: 'success'
          })
          this.$emit('refresh')
        } catch (e) {
          console.log('创建失败', e)
          this.tx.showMsg(this.$t('home.Create.create_stream_failed'))
          setTimeout(() => {
            this.tx.showDialog(false)
          }, 1000)
          this.$message({
            message: this.$t('home.Create.Failure'), // e.message + e.code,
            type: 'warning'
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import '../index.scss';
</style>
