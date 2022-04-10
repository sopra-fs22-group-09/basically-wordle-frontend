import { createClient } from 'graphql-ws';

import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { HttpLink } from '@apollo/client/link/http';
import { ApolloClient, ApolloLink, InMemoryCache, split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { getHttpDomain, getWsDomain } from '../utils/getDomain';
import { onError } from '@apollo/client/link/error';

const commonHeaders = {
  'Content-Type': 'application/json;charset=utf-8',
  Accept: 'application/graphql+json',
  'Content-Encoding': 'deflate, gzip',
};

function getSession() {
  // TODO: Maybe needs selective enablement?
  const token = { token: localStorage.getItem('token') || '' };
  return token;
}

function logout() {
  // TODO: Implement here or elsewhere! Also reset store(s)!
  console.log('Logout');
}

const httpApi = new HttpLink({
  uri: `${getHttpDomain()}/graphql`,
  headers: () => {
    const session = getSession();
    if (!session) {
      return commonHeaders;
    }
    return {
      Authorization: `Bearer ${session.token}`,
      ...commonHeaders,
    };
  },
});

const wsApi = new GraphQLWsLink(
  createClient({
    url: `${getWsDomain()}/graphqlws`,
    connectionParams: () => {
      const session = getSession();
      if (!session) {
        return commonHeaders;
      }
      return {
        Authorization: `Bearer ${session.token}`,
        ...commonHeaders,
      };
    },
  })
);

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitApi = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsApi,
  httpApi
);

const afterwareLink = new ApolloLink((operation, forward) => {
  return forward(operation).map(response => {
    const context = operation.getContext();
    const { response: { headers } } = context;

    if (headers) {
      const authToken = headers.get('Authorization');
      if (authToken) {
        localStorage.setItem('token', authToken.split('Bearer ')[1]);
      }
    }

    return response;
  });
});

const logoutLink = onError(({ networkError, graphQLErrors }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      //console.log(err);
      switch (err.extensions.code) {
      case 'UNAUTHORIZED':
        logout();
      }
    }
  }
  else if (networkError) {
    if ('statusCode' in networkError) {
      if (networkError.statusCode === 401) logout();
    }
  }
});

const api = new ApolloClient({
  link: logoutLink.concat(afterwareLink).concat(splitApi),
  credentials: 'include',
  cache: new InMemoryCache(),
});

export default api;
