import { ethers } from 'ethers'

// 初始化或更新/新建provider时调用此函数
// TODO 动态化，MetaMask的当前网络优先env配置里的。
// TODO 申请 infura key
// 节点固定为InfuraProvider
export const getProvider = (network) => {
  const provider = new ethers.providers.InfuraProvider(network || process.env.DEFAULT_ETHEREUM_NETWORK)
  return provider
}

// 加载此文件即初始化provider，自带延迟加载功能
export const provider = getProvider()
