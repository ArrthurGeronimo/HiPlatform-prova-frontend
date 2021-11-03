import { getCookie, setCookie, deleteCookie } from 'utils/cookie'
import { getItem, setItem, deleteItem } from 'utils/localStorage'

async function getStorage(key: string) {
  const cookie = await getCookie(key)
  const localStorage = await getItem(key)

  if (cookie) {
    if (!localStorage || cookie !== localStorage) {
      setItem({ key: key, value: cookie })
    }
    return cookie
  }

  if (localStorage) {
    if (!cookie || cookie !== localStorage) {
      setCookie({ key: key, value: localStorage })
    }
    return localStorage
  }

  return
}

async function setStorage(key: string, value: string) {
  await setCookie({ key: key, value: value })
  await setItem({ key: key, value: value })
  return
}

async function deleteStorage(key: string) {
  await deleteCookie(key)
  await deleteItem(key)
  return
}

export { setStorage, getStorage, deleteStorage }
