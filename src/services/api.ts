import { createClient } from 'graphql-ws'

import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { HttpLink } from '@apollo/client/link/http'
import { ApolloClient, InMemoryCache, split } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { getHttpDomain, getWsDomain } from '../utils/getDomain'

const commonHeaders = {
  'Content-Type': 'application/json;charset=utf-8',
  Accept: 'application/graphql+json',
  'Content-Encoding': 'deflate, gzip',
}

function getSession() {
  // TODO: Yes, to do!
  const token = { token: null }
  return token
}

const httpApi = new HttpLink({
  uri: `${getHttpDomain()}/graphql`,
  headers: () => {
    const session = getSession()
    if (!session) {
      return commonHeaders;
    }
    return {
      Authorization: `Bearer ${session.token}`,
      ...commonHeaders
    }
  },
})

const wsApi = new GraphQLWsLink(
  createClient({
    url: `${getWsDomain()}/graphqlws`,
    connectionParams: () => {
      const session = getSession()
      if (!session) {
        return commonHeaders;
      }
      return {
        Authorization: `Bearer ${session.token}`,
        ...commonHeaders
      }
    },
  })
)

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitApi = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
  },
  wsApi,
  httpApi
)

const api = new ApolloClient({
  link: splitApi,
  cache: new InMemoryCache(),
})

export default api;
