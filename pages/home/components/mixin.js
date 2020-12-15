import { XHalfLifeContract } from '@/api/contract'

export default {
  data () {
    return {
      streamIdQueue: [], // 请求队列
      reqCount: {} // 请求次数
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
      const self = this
      const id = this.streamIdQueue.shift()

      try {
        this.reqCount[id] = this.reqCount[id] ? ++this.reqCount[id] : 1 // 记录请求次数

        if (this.reqCount[id] < 4) { // 最多请求三次
          console.log('refreshBalanceOfStreams', id)
          const ret = await XHalfLifeContract.balanceOf(id)
          this.$store.commit('updateBalanceByStreamId', { key: id, value: ret })
        }

        this.timer = setTimeout(function () {
          self.refreshBalanceOfStreams()
        }, 100)
      } catch (e) {
        this.streamIdQueue.push(id) // 重新入队
        this.timer = setTimeout(function () {
          self.refreshBalanceOfStreams()
        }, 100)
      }
    }
  }
}
