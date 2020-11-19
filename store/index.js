export const state = () => ({
  network: process.env.DEFAULT_ETHEREUM_NETWORK,
  provider: null,

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
  detailCache: {}
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
  updateBalanceByStreamId (state, { key, value }) {
    if (state.detailCache[key]) {
      state.detailCache[key] = { ...state.detailCache[key], ...value }
    } else {
      state.detailCache[key] = value
    }
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
  }
}

export const getters = {
  isMetaMaskConnected: (state) => {
    console.log('getters', state)
    return !!state.metamask.account
  }
}
