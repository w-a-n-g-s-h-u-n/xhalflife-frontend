<template>
  <div class="wrap">
    <el-form
      label-position="top"
      label-width="80px"
      :model="formData"
      :rules="rules"
      ref="createForm"
      class="form">
      <el-form-item label="Which Token" prop="token">
        <el-autocomplete
          size="medium"
          v-model="formData.token"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
          @select="handleSelect"
          style="width: 100%;"
        ></el-autocomplete>
        <!-- <el-select v-model="formData.token" placeholder="请选择" style="width: 100%;">
          <el-option
            v-for="item in tokenOptions"
            :key="item.name"
            :label="`${item.symbol}`"
            :value="item.symbol">
            <span>{{item.symbol}} ({{item.name}})</span>
          </el-option>
        </el-select> -->
      </el-form-item>
      <el-form-item :label="`How Much To Start (available: ${currentTokenAmount} ${currentToken})`" prop="depositAmount">
        <el-input v-model="formData.depositAmount">
          <span slot='suffix' class="symbol">{{currentToken}}</span>
          <el-button slot='append' @click="maxAmount" class="maxButton">MAX</el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="The Recipent Address" prop="recipient">
        <el-input v-model="formData.recipient" />
      </el-form-item>

      <el-row :gutter="15">
        <el-col :span="isMobile ? 24 : 8" >
          <el-form-item label="When Should Start" class="input-style-2" prop="startBlock">
            <el-input v-model="formData.startBlock" placeholder="" />
          </el-form-item>
        </el-col>
        <el-col :span="isMobile ? 24 : 8">
          <el-form-item label="Unlock K Block" prop="kBlock">
            <el-input v-model="formData.kBlock" placeholder="" />
          </el-form-item>
        </el-col>
        <el-col :span="isMobile ? 24 : 8">
          <el-form-item label="Unlock Ratio" prop="unlockRatio">
            <el-input v-model="formData.unlockRatio" placeholder="">
              <template slot='append'>‰</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="actions">
      <el-button type="primary" round class="start-btn btn" @click="onSubmit">
        Start
      </el-button>
    </div>
  </div>
</template>

<script>
// import {
// // XHalfLifeContract,
//   getXHalfLifeContractWithSigner
// } from '@/api/contract'
import {
  getProvider
  // , provider
} from '@/api/contract/ethers'
import metamask from '@/api/wallet/metamask'
import { SUPPORT_TOKENS } from '@/api/apollo/queries'
import { ethers } from 'ethers'
import XHalfLifeABI from '@/api/contract/abis/XHalfLife.json'
import { isMobile } from '@/utils/index'
import { mapState } from 'vuex'
import { selectAbi } from '@/api/contract'
import { decimalsNumber } from '@/utils'

// import { ABI, KOVAN_ADDRESS } from '@/api/contract/abis/TEST'
// import { ABI as XHALFLIFEMYTESTABI, KOVAN_ADDRESS as XHALFLIFEMYTESTKOVAN_ADDRESS } from '@/api/contract/abis/XHalfLifeMyTest'

export default {
  name: 'CreateStreamForm',
  data () {
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
      isMobile: isMobile(),
      balances: [],
      rules: {
        recipient: [
          { required: true, message: 'recipient is required', trigger: 'change' }
        ],
        depositAmount: [
          { required: true, message: 'depositAmount is required', trigger: 'change' }
        ],
        startBlock: [
          { required: true, message: 'startBlock is required', trigger: 'change' }
        ],
        kBlock: [
          { required: true, message: 'kBlock is required', trigger: 'change' }
        ],
        unlockRatio: [
          { required: true, message: 'unlockRatio is required', trigger: 'change' }
        ]
      }
    }
  },
  async mounted () {
    const provider = await getProvider()
    const blockNumber = await provider.getBlockNumber()
    this.formData.startBlock = blockNumber + 10
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
  created () {
    this.fetchSupportToken()
  },
  methods: {
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
              message: 'Please check the address',
              type: 'warning'
            })
          }
        } else if (queryString.length > 20) {
          this.$message({
            message: 'Please check the address',
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
            message: 'Please check the form data',
            type: 'warning'
          })
          return
        }
        try {
          const formData = { ...this.formData }
          const tokenDecimals = this.selectDecimalsByName(formData.token)
          const tokenAddress = this.selectAddressByName(formData.token)
          console.log(tokenAddress, tokenDecimals)

          if (!formData.token || !formData.recipient || !formData.depositAmount || !formData.startBlock || !formData.kBlock || !formData.unlockRatio) {
            this.$message({
              message: 'Please check input fields',
              type: 'warning'
            })
            return
          }

          const accounts = await metamask.connectMetaMask()
          if (!accounts.length) {
            this.$message({
              message: 'Need connect to metemask account first',
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
              const approveResult = await approveTx.wait()
              console.log('approveResult', approveResult)
              // this.$message('Please wait MetaMast to approve')
            }

            console.log(tokenAddress, recipient, decimalsAmount.toString(), startBlock, kBlock, decimalsRatio)
            tx = await contract.createStream(tokenAddress, recipient, decimalsAmount.toString(), startBlock, kBlock, decimalsRatio)
          }

          const createStreamResult = await tx.wait()
          // this.$message('Please wait MetaMast to create the stream')
          console.log('createStreamResult', createStreamResult)
          this.$message({
            message: 'Create stream successfully',
            type: 'success'
          })
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
  .wrap {
    text-align: left;
    width: 500px;
    margin: 4rem auto;

    .maxButton {
      color: #fced3e;
      padding: 0 15px;
    }

    .symbol {
      line-height: 40px;
      margin-right: 10px;
    }

    .el-form-item__label {
      color: #fff !important;
    }

    .el-form--label-top .el-form-item__label {
      color: #fff;
    }

    .actions {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .btn {
        width: 343px;
        margin: 0 auto;
      }

      .start-btn {
        background-image: linear-gradient(136deg, #2bf7dd 0%, #3a8ff7 51%, #da37fa 100%);
        border-radius: 28px;
        margin-bottom: 10px;
      }
    }

    .input-style-2 {
      border: 0 solid #4c4f8a;
      border-radius: 22px;
    }
  }

  @media (max-width: 768px) {
    .wrap {
      width: 100%;

      .actions {
        .btn {
          width: 100%;
          margin-top: 1rem;
        }
      }
    }
  }

</style>
