export const jsonParse = <T>(text: string): T => {
  try {
    return JSON.parse(text)
  } catch {
    return {} as T
  }
}
