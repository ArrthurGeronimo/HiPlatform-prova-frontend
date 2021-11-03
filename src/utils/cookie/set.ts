import { setCookie } from 'nookies'

interface ICookie {
  key: string
  value: string
}

export default async function Create({ key, value }: ICookie) {
  setCookie(undefined, key, value, {
    maxAge: 60 * 60 * 24 * 30 * 12,
    path: '/',
  })

  return true
}
