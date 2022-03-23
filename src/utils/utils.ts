/* eslint-disable @typescript-eslint/ban-types */
type WithChildren<T = {}> = T & { children?: React.ReactNode };

export type { WithChildren };
