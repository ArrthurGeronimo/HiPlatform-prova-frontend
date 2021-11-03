import '@fontsource/poppins'

import { ChakraProvider, CSSReset, Box } from '@chakra-ui/react'

import theme from '../src/styles/theme'

export const decorators = [
  (Story) => (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <Box m={5}>
        <Story />
      </Box>
    </ChakraProvider>
  ),
]
