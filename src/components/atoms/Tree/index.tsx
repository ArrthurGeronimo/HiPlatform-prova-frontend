import { useEffect, useState } from 'react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { Box, Flex, Text } from '@chakra-ui/react'
import Checkbox from 'components/atoms/Checkbox'
import { SidebarDrawerProvider } from './TreeContext'
import { useSidebarDrawer } from './TreeContext'

const Tree = ({ data = {}, codeNode }) => {
  return (
    <Box>
      <Box as="ul" listStyleType="none" padding={0}>
        {Object.entries(data).map((tree, index) => (
          <TreeNode key={index} node={tree} codeNode={codeNode || undefined} />
        ))}
      </Box>
    </Box>
  )
}

const TreeNode = ({ node, codeNode }) => {
  const { onSelect, selectedKeys, indeterminateKeys } = useSidebarDrawer()
  const [childVisible, setChildVisiblity] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const [isIndeterminate, setIsIndeterminate] = useState(false)

  const hasChild = Object.keys(node[1].children).length > 0 ? true : false
  codeNode = codeNode ? `${codeNode}-${node[0]}` : node[0]

  function onChecked(node, codeNode) {
    setIsChecked(!isChecked)
    onSelect(node, codeNode)
  }

  useEffect(() => {
    if (selectedKeys.has(codeNode)) {
      setIsIndeterminate(false)
      return setIsChecked(true)
    } else {
      if (indeterminateKeys.has(codeNode)) {
        return setIsIndeterminate(true)
      }
    }
    setIsIndeterminate(false)
    setIsChecked(false)
  }, [codeNode, selectedKeys, indeterminateKeys])

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
          checked={isChecked}
          indeterminate={isIndeterminate}
          onChange={() => onChecked(node, codeNode)}
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
    <SidebarDrawerProvider data={data}>
      <Tree data={data} />
    </SidebarDrawerProvider>
  )
}
