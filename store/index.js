import { getProvider } from '@/api/contract/ethers'

export const state = () => ({
  network: process.env.DEFAULT_ETHEREUM_NETWORK,
  provider: null,

  // 整体统计
  stats: {
    totalCount: 0,
    xdexLocked: '',
    xdexWithdrawed: ''
  },
  // 支持不同钱包
  metamask: {
    account: null,
    accounts: []
  },
  balanceInfo: {
    // [streamId]: { a, b }
  },

  // 页面数据
  homeList: [],
  myReceivedList: [],
  MySentList: [],
  detailCache: {},

  blockNumber: 0 // 最新区块
})

export const mutations = {
  update (state, { key, value }) {
    state[key] = value
  },
  updateSteamList (state, { key, value }) {
    state[key] = value

    value.map((item) => {
      if (state.detailCache[item.id]) {
        state.detailCache[item.id] = { ...state.detailCache[item.id], ...item }
      } else {
        state.detailCache[item.id] = item
      }
    })
    state.detailCache = { ...state.detailCache }
  },
  updateSteamDetail (state, item) {
    if (item && item.id) {
      if (state.detailCache[item.id]) {
        state.detailCache[item.id] = { ...state.detailCache[item.id], ...item }
      } else {
        state.detailCache[item.id] = item
      }
      state.detailCache = { ...state.detailCache }
    }
  },
  updateBalanceByStreamId (state, { key, value }) {
    if (state.detailCache[key]) {
      state.detailCache[key] = { ...state.detailCache[key], ...value }
    } else {
      state.detailCache[key] = value
    }
    state.detailCache = { ...state.detailCache }
  },
  updateAccounts (state, { accounts, source }) {
    // 目前仅支持 metamask
    state.metamask = {
      accounts,
      account: accounts && accounts.length && accounts[0]
    }
  },
  updateBalanceInfo (state, { streamId, info }) {
    state.balanceInfo[streamId] = info
  },
  updateStats (state, payload) {
    state.stats = payload || { totalCount: 0 }
  }
}

export const getters = {
  isMetaMaskConnected: (state) => {
    console.log('getters', state)
    return !!state.metamask.account
  }
}

export const actions = {
  async refreshLatestBlockNumber (context) {
    const provider = await getProvider()
    const blockNumber = await provider.getBlockNumber()
    context.commit('update', { key: 'blockNumber', value: blockNumber })
    return blockNumber
  }
}
