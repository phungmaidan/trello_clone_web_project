import { experimental_extendTheme as extendTheme } from '@mui/material/styles'
import { cyan, orange, teal } from '@mui/material/colors'

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
  }
  // ...other properties
})
export default theme
