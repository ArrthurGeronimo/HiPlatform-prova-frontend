interface LocalStorageProps {
  key: string
  value: string
}

export default async function Set({ key, value }: LocalStorageProps) {
  if (!key || !value) return false
  localStorage.setItem(key, value)
  return true
}
