import { getProvider, provider } from '@/api/contract/ethers'
import { decimalsNumber } from '@/utils/index'
import { CHAIN_LABEL } from '@/config'
import metamask from '@/api/wallet/metamask'
const initialMetamask = {
  account: null,
  accounts: [],
  xdexBalance: 0,
  chainId: ''
}

export const state = () => ({
  network: process.env.DEFAULT_ETHEREUM_NETWORK,
  chainId: process.env.DEFAULT_CHAIN_ID,
  provider: null,

  // 整体统计
  stats: {
    totalCount: 0,
    xdexLocked: '',
    xdexWithdrawed: ''
  },
  // 支持不同钱包
  metamask: initialMetamask,
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
  logout (state) {
    state.metamask = initialMetamask
  },
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
  // accounts, chainId, source
  updateAccounts (state, payload) {
    const { accounts, balances } = payload
    // 目前仅支持 metamask
    state.metamask = state.metamask || {}
    state.metamask = {
      ...state.metamask,
      ...payload,
      account: accounts && accounts.length && accounts[0],
      xdexBalance: decimalsNumber(balances)
    }
  },
  updateChainId (state, { chainId, source }) {
    state.metamask = state.metamask || {}
    state.metamask = {
      ...state.metamask,
      chainId
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
    return !!state.metamask.account
  },
  isMetaMaskNetworkRight: (state) => {
    return CHAIN_LABEL[state.metamask.chainId] //  是否在支持列表里
  },
  currentAccount: (state) => {
    return state.metamask.account
  },
  metamaskChainId: (state) => {
    return state.metamask.chainId
  }
}

export const actions = {
  async connectWallwet (context) {
    const accounts = await metamask.connectMetaMask()
    context.commit('updateAccounts', { accounts, source: 'MetaMask' })
  },
  async refreshLatestBlockNumber (context) {
    // const provider = await getProvider()
    const blockNumber = await provider.getBlockNumber()
    context.commit('update', { key: 'blockNumber', value: blockNumber })
    return blockNumber
  }
}
