import { ApolloProvider } from '@apollo/client';
//import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import React from 'react';
//import { createRoot } from 'react-dom/client';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './redux/store';
import reportWebVitals from './reportWebVitals';
import api from './services/api';

// eslint-disable-next-line import/no-named-as-default-member
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ApolloProvider client={api}>
        <NotificationsProvider>
          <App />
        </NotificationsProvider>
      </ApolloProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('app')
);

// FIXME: The React 18 way. As you might have guessed, it doesn't work: https://github.com/apollographql/apollo-client/issues/9664
/*const container = document.getElementById('app');
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ApolloProvider client={api}>
        <NotificationsProvider>
          <App />
        </NotificationsProvider>
      </ApolloProvider>
    </Provider>
  </React.StrictMode>
);*/

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
