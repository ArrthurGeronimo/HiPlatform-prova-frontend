import { destroyCookie } from 'nookies'

export default async function Delete(key: string) {
  destroyCookie(null, key)

  return true
}
