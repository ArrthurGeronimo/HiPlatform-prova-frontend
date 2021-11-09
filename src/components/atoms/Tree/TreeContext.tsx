import { UseDisclosureReturn } from '@chakra-ui/react'
import {
  useEffect,
  useState,
  createContext,
  ReactNode,
  useContext,
} from 'react'
import { setStorage, getStorage } from 'utils/helpers/SirStorage'

interface Metadata {
  key: string
  value: unknown
}

interface MetadataObj {
  [key: string]: Metadata
}

interface TreeProviderProps {
  children: ReactNode
  data: MetadataObj
}

interface ChildrenProps {
  children: ReactNode
  parent: string
}

type TreeContextData = UseDisclosureReturn

const TreeContext = createContext({} as TreeContextData)

export function TreeProvider({ children, data }: TreeProviderProps) {
  const [dataRef, setDataRef] = useState()
  const [loading, setLoading] = useState(true)

  async function findTheParent(children: ChildrenProps) {
    const parent = children.parent
    if (!dataRef) return
    if (parent) {
      let numberOfChildrenChecked = 0
      let numberOfChildrenIndeterminate = 0
      for (let i = 0; i < dataRef[parent].children.length; i++) {
        const childrenId = dataRef[parent].children[i]
        // children unchecked
        if (dataRef[childrenId].checked) {
          numberOfChildrenChecked = numberOfChildrenChecked + 1
        }
        if (dataRef[childrenId].indeterminate) {
          numberOfChildrenIndeterminate = numberOfChildrenIndeterminate + 1
        }
      }
      if (numberOfChildrenChecked === 0) {
        const newParent = dataRef[parent]
        newParent.indeterminate = false
        newParent.checked = false
        setDataRef({ ...dataRef, [parent]: newParent })
      }
      if (
        (numberOfChildrenChecked > 0 &&
          numberOfChildrenChecked < dataRef[parent].children.length) ||
        numberOfChildrenIndeterminate > 0
      ) {
        const newParent = dataRef[parent]
        newParent.indeterminate = true
        newParent.checked = false
        setDataRef({ ...dataRef, [parent]: newParent })
      }
      if (numberOfChildrenChecked === dataRef[parent].children.length) {
        const newParent = dataRef[parent]
        newParent.indeterminate = false
        newParent.checked = true
        setDataRef({ ...dataRef, [parent]: newParent })
      }
      if (dataRef[parent].parent) {
        findTheParent(dataRef[parent])
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
    nodeSelected.checked = !nodeSelected.checked
    setDataRef({ ...dataRef, [dataRef[id]]: nodeSelected })
    if (dataRef[id].checked) {
      checkChildren(nodeSelected)
      findTheParent(nodeSelected)
    } else {
      uncheckChildren(nodeSelected)
      findTheParent(nodeSelected)
    }

    Object.filter = (obj, predicate) =>
      Object.keys(obj)
        .filter((key) => predicate(obj[key]))
        .reduce((res, key) => ((res[key] = obj[key]), res), {})
    const selectedKeys = Object.filter(dataRef, (item) => item.checked === true)
    console.log('selectedKeys: ', selectedKeys)
  }

  useEffect(() => {
    if (dataRef) {
      setStorage('dataRef', JSON.stringify(dataRef))
    }
  }, [dataRef])

  useEffect(() => {
    async function prepareDataRef() {
      const dataRefStorage = await getStorage('dataRef')
      if (dataRefStorage) {
        setDataRef(JSON.parse(dataRefStorage))
        return setLoading(false)
      }
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
