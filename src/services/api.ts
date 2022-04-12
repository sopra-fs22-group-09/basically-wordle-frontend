import { createClient } from 'graphql-ws';

import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { HttpLink } from '@apollo/client/link/http';
import { ApolloClient, ApolloLink, InMemoryCache, split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { getHttpDomain, getWsDomain } from '../utils/getDomain';
import { onError } from '@apollo/client/link/error';
import { logout } from '../utils/utils';

const commonHeaders = {
  Accept: 'application/graphql+json',
  'Content-Type': 'application/graphql+json;charset=utf-8',
};

function getSession() {
  // TODO: Maybe needs selective enablement?
  const token = { token: localStorage.getItem('token') || '' };
  return token;
}

function giveMeHeaders() {
  const session = getSession();
  if (!session) {
    return commonHeaders;
  }
  return {
    Authorization: `Bearer ${session.token}`,
    ...commonHeaders,
  };
}

const httpApi = new HttpLink({
  uri: `${getHttpDomain()}/graphql`,
  headers: giveMeHeaders()
});

const wsApi = new GraphQLWsLink(
  createClient({
    url: `${getWsDomain()}/graphqlws`,
    connectionParams: giveMeHeaders()
  })
);

const afterwareLink = new ApolloLink((operation, forward) => {
  return forward(operation).map(response => {
    const context = operation.getContext();
    const { response: { headers } } = context;

    if (headers) {
      const authToken = headers.get('authorization');
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

const splitAfterware = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return !(definition.kind === 'OperationDefinition' && definition.operation === 'subscription');
  },
  afterwareLink,
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

const api = new ApolloClient({
  link: splitAfterware.concat(logoutLink).concat(splitApi),
  credentials: 'include',
  cache: new InMemoryCache(),
});

export default api;
