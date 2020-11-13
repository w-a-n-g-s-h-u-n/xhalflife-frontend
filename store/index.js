
export const state = () => ({
  network: process.env.DEFAULT_ETHEREUM_NETWORK,
  provider: null,

  // 支持不同钱包
  metamask: {
    account: null,
    accounts: []
  }

})

export const mutations = {
  update (state, { key, value }) {
    state[key] = value
  },
  updateAccounts (state, { accounts, source }) {
    // 目前仅支持 metamask
    state.metamask = {
      accounts,
      account: accounts && accounts.length && accounts[0]
    }
  }
}

export const getters = {
  isMetaMaskConnected: (state) => {
    console.log('getters', state)
    return !!state.metamask.account
  }
}
