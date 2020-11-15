<template>
  <div class="wrap">
    <el-form label-position="top" label-width="80px" :model="formData" class="form">
      <el-form-item label="Which Token">
        <el-input v-model="formData.token" />
      </el-form-item>
      <el-form-item label="How Much To Start">
        <el-input v-model="formData.depositAmount" />
      </el-form-item>
      <el-form-item label="The Recipent Address">
        <el-input v-model="formData.recipient" />
      </el-form-item>

      <div style="display: flex; justify-content: space-around; align-items: center;">
        <el-form-item label="When Should Start" class="input-style-2" style="width: 30%;">
          <el-input v-model="formData.startBlock" placeholder="" />
        </el-form-item>
        <el-form-item label="Unlock K Block" style="width: 30%;">
          <el-select v-model="formData.kBlock" placeholder="活动区域">
            <el-option label="100" value="100" />
            <el-option label="200" value="200" />
          </el-select>
        </el-form-item>

        <el-form-item label="Unlock Ratio" style="width: 30%;">
          <el-select v-model="formData.unlockRatio" placeholder="活动区域">
            <el-option label="0.1%" value="0.1" />
            <el-option label="0.2" value="0.2" />
            <el-option label="0.3" value="0.3" />
          </el-select>
        </el-form-item>
      </div>
    </el-form>
    <div class="actions">
      <el-button type="primary" round class="start-btn btn" @click="onSubmitV2">
        Start
      </el-button>

      <!--      <el-button type="primary" round class="start-btn btn" @click="testStreamMine">-->
      <!--        Start Mine-->
      <!--      </el-button>-->
      <!--      <el-button round class="cancel-btn btn" @click="test">-->
      <!--        TEST-->
      <!--      </el-button>-->
    </div>
  </div>
</template>

<script>
import {
// XHalfLifeContract,
  getXHalfLifeContractWithSigner
} from '@/api/contract'
import {
  getProvider
  // , provider
} from '@/api/contract/ethers'
import metamask from '@/api/wallet/metamask'

import { ethers } from 'ethers'
import XHalfLifeABI from '@/api/contract/abis/XHalfLife'
import XDEX_ABI from '@/api/contract/abis/XDEX'

// import { ABI, KOVAN_ADDRESS } from '@/api/contract/abis/TEST'
// import { ABI as XHALFLIFEMYTESTABI, KOVAN_ADDRESS as XHALFLIFEMYTESTKOVAN_ADDRESS } from '@/api/contract/abis/XHalfLifeMyTest'

export default {
  name: 'CreateStreamForm',
  data () {
    return {
      formData: {
        token: 'XDEX',
        recipient: '0xdBd15395D77eEd497657f935CcBE798C922A2d72',
        depositAmount: '100000000000000000000',
        startBlock: '23196060', // 22096060
        kBlock: '40',
        unlockRatio: '1000000000000000' // '1000000000000000'
      }
    }
  },
  methods: {
    async onSubmitOld () {
      console.log(this.formData)

      try {
        const provider = await getProvider()

        const accounts = await metamask.connectMetaMask()
        console.log('accounts', accounts)

        const signer = provider.getSigner()

        const contractWithSigner = getXHalfLifeContractWithSigner(signer)
        // const contractWithSigner = contract.connect(signer)

        console.log('contract', contractWithSigner)

        console.log('contract.signer', contractWithSigner.signer)

        const { recipient, depositAmount, startBlock, kBlock, unlockRatio } = this.formData

        // const gasLimitNumber = await contractWithSigner.estimateGas.createStream(
        //   recipient, depositAmount, startBlock, kBlock, unlockRatio)
        //
        // console.log('gasLimitNumber', gasLimitNumber)

        const b1 = await contractWithSigner.balanceOf(1)
        const b2 = await contractWithSigner.balanceOf(2)
        console.log('balanceOf', b1, b2)

        const tx = await contractWithSigner.createStream(recipient, depositAmount, startBlock, kBlock, unlockRatio)
        // console.log(ret)
        console.log(tx.hash)
        // await tx.wait()
      } catch (e) {
        console.log(e)
      }

      // const ret = await contract._xdex()
      // console.log('contract.balanceO', ret)
    },
    async onSubmitV2 () {
      try {
        const formData = this.formData
        console.log(formData)
        if (!formData.recipient || !formData.depositAmount || !formData.startBlock || !formData.kBlock || !formData.unlockRatio) {
          this.$message({
            message: 'Please check input fields',
            type: 'warning'
          })
          return
        }

        // 获得provider
        const provider = await getProvider()
        const signer = provider.getSigner()
        const contract = new ethers.Contract(process.env.XHALFLIFE_CONTRACT_ADDTRESS, XHalfLifeABI, signer)
        const contractXDEX = new ethers.Contract(process.env.XDEX_TOKEN_ADDRESS, XDEX_ABI, signer)

        //
        const accounts = await metamask.connectMetaMask()
        if (!accounts.length) {
          this.$message({
            message: 'Need connect to metemask account first',
            type: 'warning'
          })
          return
        }

        // 查看 XHALFLIFE_CONTRACT的已有授权额度， 不够则出发approve流程
        const allowance = await contractXDEX.allowance(accounts[0], process.env.XHALFLIFE_CONTRACT_ADDTRESS)
        console.log('allowance', allowance, accounts[0])

        const depositAmountBig = ethers.BigNumber.from(formData.depositAmount)
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
        const { recipient, depositAmount, startBlock, kBlock, unlockRatio } = this.formData
        console.log('this.formData', { recipient, depositAmount, startBlock, kBlock, unlockRatio })
        const tx = await contract.createStream(recipient, depositAmount, startBlock, kBlock, unlockRatio)
        const createStreamResult = await tx.wait()
        // this.$message('Please wait MetaMast to create the stream')
        console.log('createStreamResult', createStreamResult)
      } catch (e) {
        console.error(e)
        this.$message({
          message: e.message + e.code,
          type: 'warning'
        })
      }
    }

    // async testStream () {
    //   // try {
    //   const provider = await getProvider()
    //   const signer = provider.getSigner()
    //   const contract = new ethers.Contract(process.env.XHALFLIFE_CONTRACT_ADDTRESS, XHalfLifeABI, signer)
    //
    //   const { recipient, depositAmount, startBlock, kBlock, unlockRatio } = this.formData
    //
    //   console.log('this.formData', { recipient, depositAmount, startBlock, kBlock, unlockRatio })
    //
    //   const tx = await contract.createStream(recipient, depositAmount, startBlock, kBlock, unlockRatio)
    //   console.log('tx.hash', tx.hash)
    //   // } catch (e) {
    //   //   console.error(e)
    //   // }
    // }
    // async testStreamMine () {
    //   try {
    //     const provider = await getProvider()
    //     const signer = provider.getSigner()
    //     const contract = new ethers.Contract(XHALFLIFEMYTESTKOVAN_ADDRESS, XHALFLIFEMYTESTABI, signer)
    //     console.log('XHalfLifeMyTestKOVAN_ADDRESS', XHALFLIFEMYTESTKOVAN_ADDRESS)
    //
    //     // const contractXDEX = new ethers.Contract(process.env.XDEX_TOKEN_ADDRESS, XDEX_ABI, signer)
    //
    //     // approve
    //     // const approveResult = await contractXDEX.approve(XHALFLIFEMYTESTKOVAN_ADDRESS, this.formData.depositAmount)
    //     // console.log('approveResult', approveResult)
    //
    //     const { recipient, depositAmount, startBlock, kBlock, unlockRatio } = this.formData
    //
    //     console.log('this.formData', { recipient, depositAmount, startBlock, kBlock, unlockRatio })
    //
    //     const tx = await contract.createStream(recipient, depositAmount, startBlock, kBlock, unlockRatio)
    //     console.log('tx.hash', tx.hash)
    //   } catch (e) {
    //     console.error(e)
    //   }
    // },

    // async test () {
    //   const provider = await getProvider()
    //   const signer = provider.getSigner()
    //   const contract = new ethers.Contract(KOVAN_ADDRESS, ABI, signer)
    //
    //   const str = await contract.get()
    //   console.log('str', str)
    //
    //   // const tx = await contract.set('hello kxiang')
    //   // console.log('tx.hash', tx.hash)
    //
    //   const tx2 = await contract.add(1000, 200)
    //   console.log('tx2.hash', tx2.hash)
    //
    //   const tx3 = await contract.getCount()
    //   console.log('tx2.hash', tx3)
    // }
  }
}
</script>

<style scoped lang="scss">
  .wrap {
    text-align: left;

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

</style>
