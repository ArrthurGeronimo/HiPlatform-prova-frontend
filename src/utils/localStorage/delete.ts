export default async function Delete(key: string) {
  localStorage.removeItem(key)
  return true
}
