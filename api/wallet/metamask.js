import MetaMaskOnboarding from '@metamask/onboarding'
import { XDEXTokenContract } from '@/api/contract'

export const isMetaMaskInstalled = () => {
  // Have to check the ethereum binding on the window object to see if it's installed
  const { ethereum } = window
  return Boolean(ethereum && ethereum.isMetaMask)
}

let onboarding = null
export const goToInstallMetaMask = () => {
  const forwarderOrigin = window.location.url
  onboarding = onboarding || new MetaMaskOnboarding({ forwarderOrigin })
  onboarding.startOnboarding()
}

export const connectMetaMask = async () => {
  try {
    const { ethereum } = window
    if (ethereum.request) {
      const newAccounts = await ethereum.request({
        method: 'eth_requestAccounts'
      })
      return newAccounts
    } else {
      return await ethereum.enable()
    }
  } catch (error) {
    console.error('Error when connectMetaMask', error)
    return []
  }
}

export const getAccountBalances = async () => {
  try {
    const { ethereum } = window
    if (ethereum.request) {
      const accounts = await getAccountsByMetaMask()

      if (accounts.length) {
        const balances = await XDEXTokenContract.balanceOf(accounts[0])
        return balances
      } else {
        return 0
      }
    } else {
      return await ethereum.enable()
    }
  } catch (error) {
    console.error('Error when getAccountBalances', error)
    return []
  }
}

export const getAccountsByMetaMask = async () => {
  try {
    const { ethereum } = window
    if (ethereum.request) {
      const accounts = await ethereum.request({
        method: 'eth_accounts'
      })
      return accounts
    } else {
      return await ethereum.enable()
    }
  } catch (error) {
    console.error('Error when getAccountsByMetaMask', error)
    return []
  }
}

export default {
  isMetaMaskInstalled,
  goToInstallMetaMask,
  connectMetaMask,
  getAccountsByMetaMask
}
