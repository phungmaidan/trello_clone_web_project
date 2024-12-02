import { experimental_extendTheme as extendTheme } from '@mui/material/styles'

const theme = extendTheme({
  trello: {
    appBarHeight: '48px',
    boardBarHeight: '58px'
  },
  colorSchemes: {
    // light: {
    //   palette: {
    //     primary: teal,
    //     secondary: orange
    //   }
    // },
    // dark: {
    //   palette: {
    //     primary: cyan,
    //     secondary: orange
    //   }
    // }
  },
  // ...other properties
  components: {
    // Name of the component
    MuiCssBaseline: {
      styleOverrides:{
        body: {
          '*::-webkit-scrollbar': {
            width: '8px',
            height: '8px'
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: '#dcdde1',
            borderRadius: '8px'
          },
          '*::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'white',
            borderRadius: '8px'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform:'none',
          borderWidth:'0.5px',
          '&:hover': { borderWidth:'0.5px' }
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { fontSize: '0.875rem' }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          '& fieldset': {
            borderWidth: '0.5px !important'
          },
          '&:hover fieldset': {
            borderWidth: '1px !important'
          },
          '&:Mui-focused fieldset': {
            borderWidth: '1px !important'
          }
        }
      }
    }
  }
})
export default theme
