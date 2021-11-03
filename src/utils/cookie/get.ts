import { parseCookies } from 'nookies'

export default async function Get(name: string) {
  const { [name]: value } = parseCookies()

  return value
}
