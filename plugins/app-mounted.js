import utils from '@/utils'
import { getAccountsByMetaMask } from '@/api/wallet/metamask'

export default function ({ app, store }) {
  utils.extend(app, {
    async mounted () {
      const accounts = await getAccountsByMetaMask()
      console.log('Hooray, Nuxt.js app mounted.', accounts)

      store.commit('updateAccounts', { accounts, source: 'MetaMask' })
    }
  })
}
