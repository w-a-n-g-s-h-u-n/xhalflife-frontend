import { XHalfLifeContract } from '@/api/contract'
import { ethers } from 'ethers'
import { provider } from '@/api/contract/ethers'
import { mapGetters } from 'vuex'
import { CHAIN_CONFIG } from '@/config'


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
      const blacklisted = ['7790'];
      if (ids && ids.length) {
        this.streamIdQueue = ids.filter(id => !blacklisted.includes(id))// 初始化
        this.reqCount = {}
      }
      if (!this.streamIdQueue.length) {
        return
      }

      const configs = CHAIN_CONFIG[this.chainId]
      const multi = new ethers.Contract(
        configs.addresses.multicall,
        configs.abis.multicall,
        provider
      )
      const calls = []
      const xhalflifeContract = new ethers.utils.Interface(configs.abis.halflife)
      this.streamIdQueue.forEach((id) => {
        calls.push([configs.addresses.xHalfLife, xhalflifeContract.encodeFunctionData('balanceOf', [id])])
      })
      try {
        // @ts-ignore
        const [, response] = await multi.aggregate(calls)
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
