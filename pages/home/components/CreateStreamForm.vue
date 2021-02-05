<template>
  <div class="wrap">
    <el-form
      label-position="top"
      label-width="80px"
      :model="formData"
      :rules="rules"
      ref="createForm"
      class="form">
      <el-form-item :label="$t('home.Token')" prop="token">
        <el-autocomplete
          size="medium"
          v-model="formData.token"
          :fetch-suggestions="querySearch"
          :placeholder="$t('home.TokenPlaceholder')"
          @select="handleSelect"
          style="width: 100%;"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item :label="`${$t('home.Much')} (${$t('home.available')}: ${currentTokenAmount} ${currentToken})`" prop="depositAmount">
        <el-input v-model="formData.depositAmount">
          <span slot='suffix' class="symbol">{{currentToken}}</span>
          <el-button slot='append' @click="maxAmount" class="maxButton">MAX</el-button>
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('home.Address')" prop="recipient">
        <el-input v-model="formData.recipient" />
      </el-form-item>

      <el-row :gutter="15" class="newStyle">
        <el-col :span="isMobile ? 24 : 9" >
          <el-form-item class="input-style-2" prop="startBlock" >
            <span slot="label">{{$t('home.Should')}}<a :href="$t('homeLink')"><i class="el-icon-warning-outline"></i></a></span>
            <el-input v-model="formData.startBlock" placeholder="" />
          </el-form-item>
        </el-col>
        <el-col :span="isMobile ? 24 : 8">
          <el-form-item prop="kBlock">
            <span slot="label">{{$t('home.Block')}}<a :href="$t('homeLink')"><i class="el-icon-warning-outline"></i></a></span>
            <el-input v-model="formData.kBlock" placeholder="" />
          </el-form-item>
        </el-col>
        <el-col :span="isMobile ? 24 : 7">
          <el-form-item prop="unlockRatio">
            <span slot="label">{{$t('home.Ratio')}}<a :href="$t('homeLink')"><i class="el-icon-warning-outline"></i></a></span>
            <el-input v-model="formData.unlockRatio" placeholder="">
              <template slot='append'>‰</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="actions">
      <el-button type="primary" round class="start-btn btn" @click="onSubmit">
        {{$t('home.Start')}}
      </el-button>
    </div>
    <p class="tips">{{$t('tips')[0]}}<a href="https://etherscan.io/blocks" target="_blank">"{{$t('tips')[1]}}"</a>{{$t('tips')[2]}} {{$t('currentBlock')}}:{{blockNumber}}</p>
  </div>
</template>

<script>
import { getProvider } from '@/api/contract/ethers'
import metamask from '@/api/wallet/metamask'
import { SUPPORT_TOKENS } from '@/api/apollo/queries'
import { ethers } from 'ethers'
import XHalfLifeABI from '@/api/contract/abis/XHalfLife.json'
import { isMobile } from '@/utils/index'
import { mapState, mapActions } from 'vuex'
import { selectAbi } from '@/api/contract'
import { decimalsNumber } from '@/utils'

export default {
  name: 'CreateStreamForm',
  props: ['refresh'],
  data () {
    const recipentValidator = async (rule, value, callback) => {
      const currentAccount = await metamask.getAccountsByMetaMask()
      if(value === ethers.utils.getAddress(currentAccount[0])){
        callback(new Error(this.$t('home.recipentCantBeCurrentUser')));
      }
        callback();
    }
    return {
      tokenOptions: [],
      currentTokenAmount: 0,
      currentToken: '',
      formData: {
        token: '',
        recipient: '',
        depositAmount: undefined,
        startBlock: 0, // 22096060
        kBlock: '40',
        unlockRatio: '1' // '1000000000000000'
      },
      blockNumber: 0,
      isMobile: isMobile(),
      balances: [],
      rules: {
        recipient: [
          { required: true, message: this.$t('home.recipient'), trigger: 'change' },
          {validator: recipentValidator, message: '', trigger: 'change'}
        ],
        depositAmount: [
          { required: true, message: this.$t('home.depositAmount'), trigger: 'change' }
        ],
        startBlock: [
          { required: true, message: this.$t('home.startBlock'), trigger: 'change' }
        ],
        kBlock: [
          { required: true, message: this.$t('home.kBlock'), trigger: 'change' }
        ],
        unlockRatio: [
          { required: true, message: this.$t('home.unlockRatio'), trigger: 'change' }
        ]
      }
    }
  },
  async mounted () {
    const provider = await getProvider()
    const blockNumber = await provider.getBlockNumber()
    this.blockNumber = blockNumber
    this.formData.startBlock = blockNumber
  },
  computed: {
    ...mapState({
      xdexBalance (state) {
        return state.metamask && state.metamask.xdexBalance
      },
      selectCurrentAccount (state) {
        return state.metamask.account
      }
    })
  },
  watch: {
    async 'formData.token' (newVal, oldVal) {
      const provider = await getProvider()
      const signer = provider.getSigner()
      const tokenAddress = this.selectAddressByName(newVal)
      if (newVal.length < 20) {
        this.currentToken = newVal
      }
      if (tokenAddress === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
        const balance = await signer.getBalance()
        this.currentTokenAmount = ethers.utils.formatEther(balance)
      } else {
        const tokenContract = new ethers.Contract(tokenAddress, selectAbi(newVal.toLowerCase()), signer)
        const balanceOf = await tokenContract.balanceOf(this.selectCurrentAccount)
        this.currentTokenAmount = decimalsNumber(balanceOf, this.selectDecimalsByName(newVal))
      }
    }
  },
  async created () {
    this.fetchSupportToken()
  },
  methods: {
    ...mapActions(['refreshLatestBlockNumber']),
    async querySearch (queryString, cb) {
      let tokens = this.tokenOptions
      if (queryString) {
        if (ethers.utils.isAddress(queryString)) {
          const provider = await getProvider()
          const signer = provider.getSigner()
          const tokenContract = new ethers.Contract(queryString, selectAbi(queryString), signer)
          try {
            const name = await tokenContract.name()
            const symbol = await tokenContract.symbol()
            const balanceOf = await tokenContract.balanceOf(this.selectCurrentAccount)
            const decimals = await tokenContract.decimals()
            this.currentTokenAmount = decimalsNumber(balanceOf, decimals)
            tokens = [{
              value: symbol,
              id: queryString,
              name,
              symbol,
              decimals
            }]
            this.tokenOptions.push(tokens)
          } catch (e) {
            this.$message({
              message: this.$t('home.checkAddress'),
              type: 'warning'
            })
          }
        } else if (queryString.length > 20) {
          this.$message({
            message: this.$t('home.checkAddress'),
            type: 'warning'
          })
        }
      }
      cb(tokens)
    },
    handleSelect (item) {
      console.log(item)
    },
    maxAmount () {
      this.formData.depositAmount = this.currentTokenAmount
    },
    async fetchSupportToken () {
      const tokens = await this.$apollo.query({ query: SUPPORT_TOKENS })
      this.tokenOptions = tokens.data.tokens.map(token => ({
        ...token,
        value: token.symbol
      }))
      this.formData.token = this.tokenOptions[0].symbol
      this.currentToken = this.tokenOptions[0].symbol
    },
    selectAddressByName (name) {
      return this.tokenOptions.find(token => token.symbol === name).id
    },
    selectDecimalsByName (name) {
      return this.tokenOptions.find(token => token.symbol === name).decimals
    },
    onSubmit () {
      this.$refs.createForm.validate(async (valid) => {
        console.log('onSubmit validate', valid, this.formData)
        if (!valid) {
          this.$message({
            message: this.$t('home.checkData'),
            type: 'warning'
          })
          return
        }
        const fetchedBlockNumber = await this.refreshLatestBlockNumber()
        if (this.formData.startBlock < fetchedBlockNumber) {
          this.blockNumber = fetchedBlockNumber
          this.formData.startBlock = fetchedBlockNumber + 5
        }
        if (this.formData.unlockRatio < 1 || this.formData.unlockRatio > 1000 || !(/(^[1-9]\d*$)/.test(this.formData.unlockRatio))) {
          this.$message({
            message: this.$t('unlockRatioMess'),
            type: 'warning'
          })
          return
        }
        if (this.formData.kBlock < 1 || !(/(^[1-9]\d*$)/.test(this.formData.kBlock))) {
          this.$message({
            message: this.$t('kBlockMess'),
            type: 'warning'
          })
          return
        }

        const formData = { ...this.formData }
        const tokenDecimals = this.selectDecimalsByName(formData.token)
        const tokenAddress = this.selectAddressByName(formData.token)
        const selfAdd = await metamask.getAccountsByMetaMask()

        if (selfAdd === this.formData.recipient) {
          this.$message({
            message: this.$t('home.sameAdd'),
            type: 'warning'
          })
          return
        }
        try {
          if (!formData.token || !formData.recipient || !formData.depositAmount || !formData.startBlock || !formData.kBlock || !formData.unlockRatio) {
            this.$message({
              message: this.$t('home.checkFields'),
              type: 'warning'
            })
            return
          }

          const accounts = await metamask.connectMetaMask()
          if (!accounts.length) {
            this.$message({
              message: this.$t('home.Need'),
              type: 'warning'
            })
            return
          }

          // deal form data to api
          const { recipient, depositAmount, startBlock, kBlock, unlockRatio } = this.formData
          const decimalsAmount = ethers.utils.parseUnits(depositAmount, tokenDecimals)
          const decimalsRatio = ethers.utils.parseUnits(unlockRatio, Number(tokenDecimals) - 3).toString()

          // 获得provider
          const provider = await getProvider()
          const signer = provider.getSigner()
          const contract = new ethers.Contract(process.env.XHALFLIFE_CONTRACT_ADDTRESS, XHalfLifeABI, signer)

          let tx
          if (tokenAddress === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
            tx = await contract.createEtherStream(recipient, startBlock, kBlock, decimalsRatio, { value: decimalsAmount })
          } else {
            const tokenContract = new ethers.Contract(tokenAddress, selectAbi(formData.token.toLowerCase()), signer)
            // 查看 XHALFLIFE_CONTRACT的已有授权额度， 不够则触发approve流程
            const allowance = await tokenContract.allowance(accounts[0], process.env.XHALFLIFE_CONTRACT_ADDTRESS)
            console.log(allowance)

            if (decimalsAmount.lte(allowance)) {
              console.log('allowance is enough', allowance.toString(), decimalsAmount.toString())
            } else {
              console.log('allowance is not enough', allowance.toString(), decimalsAmount.toString())
              // approve
              const approveValue = decimalsAmount.sub(allowance)
              console.log('Need approve', approveValue)
              const approveTx = await tokenContract.approve(process.env.XHALFLIFE_CONTRACT_ADDTRESS, approveValue)
              console.log('333', approveValue)
              const approveResult = await approveTx.wait()
              console.log('approveResult', approveResult)
            }

            tx = await contract.createStream(tokenAddress, recipient, decimalsAmount.toString(), startBlock, kBlock, decimalsRatio)
          }

          const createStreamResult = await tx.wait()
          console.log('createStreamResult', createStreamResult)
          this.$message({
            message: this.$t('home.Create'),
            type: 'success'
          })
          this.$emit('refresh')
        } catch (e) {
          console.error(e)
          this.$message({
            message: e.message + e.code,
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
