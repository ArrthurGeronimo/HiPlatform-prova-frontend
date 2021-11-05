import { useState } from 'react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { Box, Flex, Text } from '@chakra-ui/react'
import Checkbox from 'components/atoms/Checkbox'
import { TreeProvider } from './TreeContext'
import { useTree } from './TreeContext'

const Tree = ({ data }) => {
  return (
    <Box>
      <Box as="ul" listStyleType="none" padding={0}>
        {Object.entries(data).map((tree, index) => (
          <TreeNode key={index} node={tree} />
        ))}
      </Box>
    </Box>
  )
}

const TreeNode = ({ node, codeNode }) => {
  const { onSelect, dataRef } = useTree()
  const [childVisible, setChildVisiblity] = useState(false)

  const hasChild = Object.keys(node[1].children).length > 0 ? true : false
  codeNode = codeNode ? `${codeNode}-${node[0]}` : node[0]

  return (
    <Box as="li" padding="0.50rem 1.25rem">
      <Flex align="center" onClick={() => setChildVisiblity((v) => !v)}>
        {hasChild && (
          <ChevronRightIcon
            transform={`rotate(${childVisible ? '90deg' : '0deg'})`}
            //onClick={() => setChildVisiblity((v) => !v)}
          />
        )}
        <Checkbox
          checked={dataRef[node[1].id].checked}
          indeterminate={dataRef[node[1].id].indeterminate}
          onChange={() => onSelect(node[1].id)}
        />
        <Text>{node[1].name}</Text>
      </Flex>

      {hasChild && childVisible && (
        <Box>
          <Box as="ul" listStyleType="none" padding={0} className="tree">
            <Tree data={node[1].children} codeNode={codeNode} />
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default function MainTree({ data }) {
  return (
    <TreeProvider data={data}>
      <Tree data={data} />
    </TreeProvider>
  )
}
