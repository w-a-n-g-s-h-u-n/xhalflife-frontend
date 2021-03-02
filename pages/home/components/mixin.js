import { XHalfLifeContract } from '@/api/contract'
import { ethers } from 'ethers'
import { provider } from '@/api/contract/ethers'
// import { isKovanEnv } from '@/utils'
// import multicall from 'xdefi-assets/abi/Multicall.json'
// import registry from 'xdefi-assets/generated/pm/registry.homestead.json'
// import registryKovan from 'xdefi-assets/generated/pm/registry.kovan.json'
// import halflifeContract from '@/api/contract/abis/XHalfLife.json'
import { mapGetters } from 'vuex'
import { CHAIN_CONFIG } from '@/config'

// const addresses = isKovanEnv() ? registryKovan.addresses : registry.addresses;
// const halflifeContractAddress = process.env.XHALFLIFE_CONTRACT_ADDTRESS

export default {
  data () {
    return {
      streamIdQueue: [], // 请求队列
      reqCount: {} // 请求次数
    }
  },
  computed: {
    ...mapGetters(['metamaskChainId']),
    chainId (state) {
      return state.metamaskChainId
    }
  },
  methods: {
    async refreshBalanceOfStreams (ids) {
      if (ids && ids.length) {
        this.streamIdQueue = ids // 初始化
        this.reqCount = {}
      }
      if (!this.streamIdQueue.length) {
        return
      }

      const configs = CHAIN_CONFIG[this.chainId]
      console.log('configs', configs)
      const multi = new ethers.Contract(
        configs.addresses.multicall,
        configs.abis.multicall,
        provider
      )

      const calls = []
      const promises = []
      const xhalflifeContract = new ethers.utils.Interface(configs.abis.halflife)

      this.streamIdQueue.forEach((id) => {
        calls.push([configs.addresses.halflife, xhalflifeContract.encodeFunctionData('balanceOf', [id])])
      })
      promises.push(multi.aggregate(calls))
      try {
        // @ts-ignore
        const [[, response]] = await Promise.all(promises)
        this.streamIdQueue.forEach((id, index) => {
          const decodeData = xhalflifeContract.decodeFunctionResult('balanceOf', response[index])
          this.$store.commit('updateBalanceByStreamId', { key: id, value: decodeData })
        })
      } catch (e) {
        console.error(e)
      }
    }
  }
}
