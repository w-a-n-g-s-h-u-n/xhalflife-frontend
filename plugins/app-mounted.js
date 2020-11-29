import utils from '@/utils'
import { getAccountsByMetaMask } from '@/api/wallet/metamask'

export default function ({ app, store }) {
  utils.extend(app, {
    async mounted () {
      const accounts = await getAccountsByMetaMask()
      console.log('Hooray, Nuxt.js app mounted.', accounts)

      store.commit('updateAccounts', { accounts, source: 'MetaMask' })

      const { ethereum } = window
      if (ethereum) {
        ethereum.on('accountsChanged', function (accounts) {
          // Time to reload your interface with accounts[0]!
          console.log('accountsChanged', accounts)
          store.commit('updateAccounts', { accounts, source: 'MetaMask' })
        })
      }
    }
  })
}
