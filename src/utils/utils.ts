/* eslint-disable @typescript-eslint/ban-types */
import React from 'react';
import {useMutation} from "@apollo/client";

type WithChildren<T = {}> = T & { children?: React.ReactNode };

export type { WithChildren };

const [logoutnUser, { data, loading, error }] = useMutation<LoginType, LoginData>(LOGIN_USER);

export function logout() {
  localStorage.clear();


  logoutUser({
    variables: {
      user: {
      },
      onCompleted(data) {

      }
    });



  window.location.reload();

  //console.log('Logout');
}