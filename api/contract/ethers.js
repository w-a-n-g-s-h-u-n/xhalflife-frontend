import { ethers } from 'ethers'
import metamask from '@/api/wallet/metamask'

// 初始化或更新/新建provider时调用此函数
// TODO 动态化，MetaMask的当前网络优先env配置里的。
// TODO 申请 infura key
// 节点固定为InfuraProvider

const ETHEREUM_NODE_URL = `https://kovan.infura.io/v3/${process.env.INFRUA_KEY ? process.env.INFRUA_KEY: '5368c27268fd4e8d87547e6e659605b1'}`

const App = {}

export const getProvider = async (network) => {
  // const provider = new ethers.providers.InfuraProvider(network || process.env.DEFAULT_ETHEREUM_NETWORK)
  // return provider

  if (App.provider) { return App.provider }

  // let isMetaMaskInstalled = true

  if (window.ethereum) {
    App.web3Provider = window.ethereum
    // App.provider = new ethers.providers.JsonRpcProvider(atob(ETHEREUM_NODE_URL))
    try {
      // Request account access
      // await window.ethereum.enable()
      await metamask.connectMetaMask()
    } catch (error) {
      // User denied account access...
      console.error('User denied account access')
    }
    App.provider = new ethers.providers.Web3Provider(window.ethereum)
  } else if (window.web3) {
    App.provider = new ethers.providers.Web3Provider(window.web3.currentProvider)
  } else {
    // If no injected web3 instance is detected, fall back to backup node
    App.provider = new ethers.providers.JsonRpcProvider(atob(ETHEREUM_NODE_URL))
    // isMetaMaskInstalled = false
    // _print("You don't have MetaMask installed! Falling back to backup node...\n (will likely to fail. Please install MetaMask extension).\n")
    // sleep(10)
  }

  return App.provider
}

// 加载此文件即初始化provider，自带延迟加载功能
// export const provider = getProvider()
export const provider = new ethers.providers.InfuraProvider(process.env.DEFAULT_ETHEREUM_NETWORK, process.env.INFRUA_KEY ? process.env.INFRUA_KEY: '5368c27268fd4e8d87547e6e659605b1')
