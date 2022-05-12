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
      GameColoring: {
        colors: {
          correctPosition: string;
          inWord: string;
          notInWord: string;
          notUsed: string;
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
      GameColoring: {
        colors: {
          correctPosition: string;
          inWord: string;
          notInWord: string;
          notUsed: string;
        }
      }
    };
  }

  interface BreakpointOverrides {
    mobile: true;
  }
}

export default {};