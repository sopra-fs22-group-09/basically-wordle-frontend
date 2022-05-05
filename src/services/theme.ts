/*
** If you're asking yourself why:
** https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
** https://mui.com/material-ui/customization/theming/#custom-variables
*/
declare module '@mui/material/styles' {
  interface Theme {
    additional: {
      UiBallLoader: {
        colors: {
          main: string;
        }
      }
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    additional?: {
      UiBallLoader?: {
        colors?: {
          main?: string;
        }
      }
    };
  }
}

export default {};