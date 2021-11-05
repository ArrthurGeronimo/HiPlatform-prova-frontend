import { UseDisclosureReturn } from '@chakra-ui/react'
import {
  useEffect,
  useState,
  createContext,
  ReactNode,
  useContext,
} from 'react'
//import { setStorage, getStorage } from 'utils/helpers/SirStorage'

interface TreeProviderProps {
  children: ReactNode
}

type TreeContextData = UseDisclosureReturn

const TreeContext = createContext({} as TreeContextData)

export function TreeProvider({ children, data }: TreeProviderProps) {
  const [dataRef, setDataRef] = useState()
  const [loading, setLoading] = useState(true)

  async function findTheParentAndTakeIndeterminate(children) {
    const parent = children.parent
    if (parent) {
      if (dataRef[parent].checked !== true) {
        for (let i = 0; i < dataRef[parent].children.length; i++) {
          const childrenId = dataRef[parent].children[i]
          if (dataRef[childrenId].checked) {
            return
          }
        }

        const newParent = dataRef[parent]
        newParent.indeterminate = false
        setDataRef({ ...dataRef, [parent]: newParent })
        if (dataRef[parent].parent) {
          findTheParentAndTakeIndeterminate(dataRef[parent])
        }
      }
    }
  }

  async function findTheParentAndPutIndeterminate(children) {
    const parent = children.parent
    if (parent) {
      if (dataRef[parent].checked !== true) {
        const newParent = dataRef[parent]
        newParent.indeterminate = true
        setDataRef({ ...dataRef, [parent]: newParent })
      }
      if (dataRef[parent].parent) {
        findTheParentAndPutIndeterminate(dataRef[parent])
      }
    }
  }

  async function uncheckChildren(father) {
    for (let i = 0; i < father.children.length; i++) {
      const childrenId = father.children[i]
      const newChildren = dataRef[childrenId]
      newChildren.checked = false
      setDataRef({ ...dataRef, [childrenId]: newChildren })
      const hasChild = dataRef[childrenId].children.length > 0 ? true : false
      if (hasChild) {
        for (let j = 0; j < dataRef[childrenId].children.length; j++) {
          uncheckChildren(dataRef[childrenId])
        }
      }
    }
  }

  async function checkChildren(father) {
    for (let i = 0; i < father.children.length; i++) {
      const childrenId = father.children[i]
      const newChildren = dataRef[childrenId]
      newChildren.indeterminate = false
      newChildren.checked = true
      setDataRef({ ...dataRef, [childrenId]: newChildren })
      const hasChild = dataRef[childrenId].children.length > 0 ? true : false
      if (hasChild) {
        for (let j = 0; j < dataRef[childrenId].children.length; j++) {
          checkChildren(dataRef[childrenId])
        }
      }
    }
  }

  async function onSelect(id) {
    const nodeSelected = dataRef[id]
    nodeSelected.indeterminate = false
    nodeSelected.checked = true
    setDataRef({ ...dataRef, [dataRef[id]]: nodeSelected })

    if (dataRef[id].checked) {
      checkChildren(nodeSelected)
      findTheParentAndPutIndeterminate(nodeSelected)
    } else {
      uncheckChildren(nodeSelected)
      findTheParentAndTakeIndeterminate(nodeSelected)
    }

    Object.filter = (obj, predicate) =>
      Object.keys(obj)
        .filter((key) => predicate(obj[key]))
        .reduce((res, key) => ((res[key] = obj[key]), res), {})
    const selectedKeys = Object.filter(dataRef, (item) => item.checked === true)
    console.log('selectedKeys: ', selectedKeys)
  }

  useEffect(() => {
    async function prepareDataRef() {
      const newData = {}

      async function getChildren(fatherId, children) {
        newData[fatherId].children.push(children[1].id)
        newData[children[1].id] = {
          id: children[1].id,
          name: children[1].name,
          level: children[1].level,
          children: [],
          parent: fatherId,
          checked: false,
          indeterminate: false,
        }
        const hasChild =
          Object.keys(children[1].children).length > 0 ? true : false
        if (hasChild) {
          Object.entries(children[1].children).map((newChildren) => {
            getChildren(children[1].id, newChildren)
          })
        }
      }

      Object.entries(data).map((item) => {
        newData[item[1].id] = {
          id: item[1].id,
          name: item[1].name,
          level: item[1].level,
          children: [],
          checked: false,
          indeterminate: false,
        }
        const hasChild = Object.keys(item[1].children).length > 0 ? true : false
        if (hasChild) {
          Object.entries(item[1].children).map((children) => {
            getChildren(item[1].id, children)
          })
        }
      })
      setDataRef(newData)
      setLoading(false)
    }
    prepareDataRef()
  }, [data])

  return (
    <TreeContext.Provider value={{ onSelect, dataRef }}>
      {loading ? <p>carregando</p> : children}
    </TreeContext.Provider>
  )
}

export const useTree = () => useContext(TreeContext)
