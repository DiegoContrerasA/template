import { jsonParse } from "./json-parse"

const getStorage = <T>(key: string): T | null => {
  try {
    const store = localStorage.getItem(key)
    return store ? jsonParse(store) : null
  } catch {
    return null
  }
}

const setStorage = (key: string, value: unknown): void => {
  try {
    const store = JSON.stringify(value)
    localStorage.setItem(key, store)
  } catch {
    return
  }
}
const clearStorage = (key: string | null = null): void => {
  try {
    if (key) {
      localStorage.removeItem(key)
      return
    }
    localStorage.clear()
  } catch {
    return
  }
}

export const storage = {
  get: getStorage,
  set: setStorage,
  clear: clearStorage,
}
