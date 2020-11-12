
import Vue from 'vue'
import VueApollo from 'vue-apollo'
import 'cross-fetch/polyfill'

import { client } from '@/api/apollo/client'

Vue.use(VueApollo)

// TODO 动态加载所有客户端
export default (ctx, inject) => {
  console.log('apollo plugin')

  const apolloProvider = new VueApollo({
    defaultClient: client
  })
  ctx.app.apolloProvider = apolloProvider
}
