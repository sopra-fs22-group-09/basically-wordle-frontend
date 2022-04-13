/* eslint-disable @typescript-eslint/ban-types */
import React from 'react';
import {gql, useMutation} from '@apollo/client';
import {User} from '../models/User';

type WithChildren<T = {}> = T & { children?: React.ReactNode };

export type { WithChildren };

export type LogoutInput = {
  test: string;
};

export type MutationLogoutArgs = {
  input: LogoutInput;
};

interface LogoutType {
  logout: User;
}

const LOGOUT_USER = gql`
  mutation logout {
    logout (test: $input) {
      username
    }
  }
`;

export function logout() {
  localStorage.clear();

  /*const [logoutUser, { error }] = useMutation<LogoutType, MutationLogoutArgs>(LOGOUT_USER);
  logoutUser({
    variables: {
      input: {
        test: 'dummy'
      }
    },
    onCompleted(data) {
      if (error) {
        alert(error.message);
      }
    }
  });*/

  window.location.reload();
}