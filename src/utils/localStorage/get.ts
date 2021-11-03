export default async function Get(key: string) {
  if (!key) return false
  const value = localStorage.getItem(key)
  return value
}
