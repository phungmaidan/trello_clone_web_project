import { experimental_extendTheme as extendTheme } from '@mui/material/styles'
import { cyan, orange, teal } from '@mui/material/colors'
import { BorderColor } from '@mui/icons-material'

const theme = extendTheme({
  trello: {
    appBarHeight: '48px',
    boardBarHeight: '58px'
  },
  colorSchemes: {
    light: {
      palette: {
        primary: teal,
        secondary: orange
      }
    },
    dark: {
      palette: {
        primary: cyan,
        secondary: orange
      }
    }
  },
  // ...other properties
  components: {
    // Name of the component
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform:'none'
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.primary.main,
          fontSize: '0.875rem'
        })
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.primary.main,
          fontSize: '0.875rem',
          '.MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.light
          },
          '&:hover': {
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.main
            }
          },
          // ... for no bold outline
          '& fieldset': {
            borderWidth: '1px !important'
          }
        })
      }
    }
  }
})
export default theme
