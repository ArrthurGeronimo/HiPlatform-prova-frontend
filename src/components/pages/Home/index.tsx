import { Box, Flex, Avatar, Heading, Text } from '@chakra-ui/react'
import dataJSON from './data.json'
import Tree from 'components/atoms/Tree'

export default function Home() {
  return (
    <Box p={10} bg="gray.800">
      <Heading color="white">Hi Platform Desafio de Frontend</Heading>
      <Box mt={2} ml={2}>
        <Flex>
          <Avatar src="https://avatars.githubusercontent.com/u/28739009?v=4" />
          <Box ml={4}>
            <Text>Arthur de Melo Gerônimo</Text>
            <a
              href="https://api.whatsapp.com/send?phone=5595981253585&text=Parab%C3%A9ns%2C%20a%20vaga%20%C3%A9%20sua!%20%F0%9F%8E%89"
              target="_blank"
              rel="noreferrer"
            >
              <Avatar
                size="xs"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVHacmE-M_pHIn55NM5y9ebPCCzK7GxepWjqAhZO_ZiqU0uVA-MO0TbStx2-aXXlhXABg&usqp=CAU"
              />
            </a>
          </Box>
        </Flex>
      </Box>
      <Box p={5} mt={4} bg={'gray.900'} borderRadius={10}>
        <Tree data={dataJSON} />
      </Box>
    </Box>
  )
}
