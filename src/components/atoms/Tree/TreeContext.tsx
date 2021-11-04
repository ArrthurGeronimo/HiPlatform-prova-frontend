import { UseDisclosureReturn } from '@chakra-ui/react'
import {
  //  useEffect,
  useState,
  createContext,
  ReactNode,
  useContext,
} from 'react'
//import { setStorage, getStorage } from 'utils/helpers/SirStorage'

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
  const [selectedKeys, setSelectedKeys] = useState(new Set([]))

  async function takeIndeterminate(
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
    const splitCode = childrenCode.split('-')
    /*
    let nodeChecked = undefined
    let stop = false
    for (let i = 0; i < splitCode.length - 1; i++) {
      nodeChecked = nodeChecked
        ? `${nodeChecked}-${splitCode[i]}`
        : splitCode[i]
      if (!stop) {
        if (selectedKeys.has(nodeChecked)) {
          stop = true
        }
      } else {
        if (indeterminateKeys.has(nodeChecked)) {
          await setIndeterminateKeys(
            (old) => new Set([...old].filter((x) => x !== nodeChecked))
          )
          for (const item of selectedKeys) {
            if (item.includes(`${nodeChecked}-`)) {
              await setIndeterminateKeys((old) => new Set(old.add(nodeChecked)))
            }
          }
        }
      }
    }
    if (stop) {
      return
    }
    */
    setIndeterminateKeys(
      (old) => new Set([...old].filter((x) => x !== fatherCode))
    )
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

  async function findTheParentAndTakeIndeterminate(code) {
    const codeSplit = code.split('-')
    const fatherCode = code.replace(`-${codeSplit[codeSplit.length - 1]}`, '')
    /*
    for (const item of selectedKeys) {
      if (item !== code) {
        console.log(item.includes(`${fatherCode}-`))
        if (item.includes(`${fatherCode}-`)) {
          return
        }
      }
    }
*/
    setIndeterminateKeys(
      (old) => new Set([...old].filter((x) => x !== fatherCode))
    )
    if (codeSplit.length > 1) {
      findTheParentAndTakeIndeterminate(fatherCode)
    }
  }

  async function findTheParentAndPutIndeterminate(code) {
    const codeSplit = code.split('-')
    const fatherCode = code.replace(`-${codeSplit[codeSplit.length - 1]}`, '')
    await setIndeterminateKeys((old) => new Set(old.add(fatherCode)))
    if (codeSplit.length > 1) {
      findTheParentAndPutIndeterminate(fatherCode)
    }

    /*
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
    */
  }

  async function uncheckTheChildren(node, code) {
    await setSelectedKeys((old) => new Set([...old].filter((x) => x !== code)))
    await setIndeterminateKeys(
      (old) => new Set([...old].filter((x) => x !== code))
    )
    Object.entries(node[1].children).map((children) => {
      uncheckTheChildren(children, `${code}-${children[0]}`)
    })
  }

  async function checkTheChildren(node, code) {
    await setSelectedKeys((old) => new Set(old.add(code)))
    Object.entries(node[1].children).map((children) => {
      checkTheChildren(children, `${code}-${children[0]}`)
    })
  }

  async function onSelect(node, code) {
    if (selectedKeys.has(code)) {
      uncheckTheChildren(node, code)
      findTheParentAndTakeIndeterminate(code)
      //findTheParent(node, code, false)
      return
    } else {
      checkTheChildren(node, code)
      findTheParentAndPutIndeterminate(code)
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
