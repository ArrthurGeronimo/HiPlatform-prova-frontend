import { extendTheme, withDefaultColorScheme } from '@chakra-ui/react'
import config from './config'
import styles from './styles'
import fonts from './fonts'

const customTheme = extendTheme(
  {
    config,
    fonts,
    styles,
  },
  withDefaultColorScheme({ colorScheme: process.env.NEXT_PUBLIC_COLOR_SCHEME })
)

export default customTheme
