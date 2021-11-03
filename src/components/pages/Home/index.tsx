import { Box, Heading } from '@chakra-ui/react'
import dataJSON from './data.json'
import Tree from 'components/atoms/Tree'

export default function Home() {
  return (
    <Box p={10}>
      <Heading>Hi Platform Desafio de Frontend</Heading>
      <Box p={5} mt={10} bg={'gray.900'} borderRadius={10}>
        <Tree data={dataJSON} />
      </Box>
    </Box>
  )
}
