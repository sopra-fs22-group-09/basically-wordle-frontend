/* eslint-disable @typescript-eslint/ban-types */
import { gql } from '@apollo/client';
import React from 'react';

type WithChildren<T = {}> = T & { children?: React.ReactNode };

export type { WithChildren };

export const READ_USERNAME = gql`
  fragment Friend on User {
    username
  }
`;