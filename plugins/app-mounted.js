import utils from '@/utils'
import { getAccountsByMetaMask, getAccountBalances } from '@/api/wallet/metamask'

export default function ({ app, store }) {
  utils.extend(app, {
    async mounted () {
      const { ethereum } = window
      const accounts = await getAccountsByMetaMask()

      const balances = await getAccountBalances()
      const chainId = ethereum.chainId
      store.commit('updateAccounts', { accounts, balances, chainId, source: 'MetaMask' })

      if (ethereum) {
        ethereum.on('accountsChanged', function (accounts) {
          // Time to reload your interface with accounts[0]!
          const chainId = ethereum.chainId
          store.commit('updateAccounts', { accounts, chainId, source: 'MetaMask' })
        })

        ethereum.on('chainChanged', function (chainId) {
          // Time to reload your interface with accounts[0]!
          store.commit('updateChainId', { chainId, source: 'MetaMask' })
        })
      }
    }
  })
}
