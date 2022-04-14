/* eslint-disable @typescript-eslint/ban-types */
import React, {useEffect} from 'react';

type WithChildren<T = {}> = T & { children?: React.ReactNode };

export type { WithChildren };