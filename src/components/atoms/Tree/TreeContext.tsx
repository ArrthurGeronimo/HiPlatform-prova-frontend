import { UseDisclosureReturn } from '@chakra-ui/react'
import { useState } from 'react'
import { createContext, ReactNode, useContext } from 'react'

interface SidebarDrawerProviderProps {
  children: ReactNode
}

type SidebarDrawerContextData = UseDisclosureReturn

const SidebarDrawerContext = createContext({} as SidebarDrawerContextData)

export function SidebarDrawerProvider({
  children,
  data,
}: SidebarDrawerProviderProps) {
  const [indeterminateKeys, setIndeterminateKeys] = useState(new Set())
  const [selectedKeys, setSelectedKeys] = useState(new Set())

  function takeIndeterminate(
    father,
    fatherLevel,
    fatherCode,
    indexCode,
    childrenLevel,
    childrenCode
  ) {
    if (fatherLevel === childrenLevel) {
      return
    }
    setIndeterminateKeys(
      (old) => new Set([...old].filter((x) => x !== fatherCode))
    )
    const splitCode = childrenCode.split('-')
    const newIndexCode = indexCode + 1
    const newFather = father.children[splitCode[newIndexCode]]
    const newFatherLevel = newFather.level
    const newFatherCode = `${fatherCode}-${splitCode[indexCode + 1]}`
    takeIndeterminate(
      newFather,
      newFatherLevel,
      newFatherCode,
      newIndexCode,
      childrenLevel,
      childrenCode
    )
  }

  function putIndeterminate(
    father,
    fatherLevel,
    fatherCode,
    indexCode,
    childrenLevel,
    childrenCode
  ) {
    if (fatherLevel === childrenLevel) {
      return
    }
    setIndeterminateKeys((old) => new Set(old.add(fatherCode)))
    const splitCode = childrenCode.split('-')
    const newIndexCode = indexCode + 1
    const newFather = father.children[splitCode[newIndexCode]]
    const newFatherLevel = newFather.level
    const newFatherCode = `${fatherCode}-${splitCode[indexCode + 1]}`
    putIndeterminate(
      newFather,
      newFatherLevel,
      newFatherCode,
      newIndexCode,
      childrenLevel,
      childrenCode
    )
  }

  function findTheParent(node, code, put) {
    const nodeLevel = node[1].level
    if (nodeLevel === 0) {
      return
    }
    const splitCode = code.split('-')
    const indexCode = 0
    const father = data[splitCode[indexCode]]
    const fatherLevel = 0
    const fatherCode = splitCode[0]
    const childrenLevel = node[1].level
    const childrenCode = code
    if (put) {
      return putIndeterminate(
        father,
        fatherLevel,
        fatherCode,
        indexCode,
        childrenLevel,
        childrenCode
      )
    }
    return takeIndeterminate(
      father,
      fatherLevel,
      fatherCode,
      indexCode,
      childrenLevel,
      childrenCode
    )
  }

  function uncheckTheChildren(node, code) {
    setSelectedKeys((old) => new Set([...old].filter((x) => x !== code)))
    Object.entries(node[1].children).map((children) => {
      uncheckTheChildren(children, `${code}-${children[0]}`)
    })
  }

  function checkTheChildren(node, code) {
    setSelectedKeys((old) => new Set(old.add(code)))
    Object.entries(node[1].children).map((children) => {
      checkTheChildren(children, `${code}-${children[0]}`)
    })
  }

  async function onSelect(node, code) {
    if (selectedKeys.has(code)) {
      uncheckTheChildren(node, code)
      findTheParent(node, code, false)
      return
    } else {
      checkTheChildren(node, code)
      findTheParent(node, code, true)
      return
    }
  }

  return (
    <SidebarDrawerContext.Provider
      value={{ onSelect, selectedKeys, indeterminateKeys }}
    >
      {children}
    </SidebarDrawerContext.Provider>
  )
}

export const useSidebarDrawer = () => useContext(SidebarDrawerContext)
