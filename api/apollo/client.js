import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'

export const client = new ApolloClient({
  link: new HttpLink({
    uri: process.env.APOLLO_BASE_URL
  }),
  cache: new InMemoryCache(),
  shouldBatch: true
})
