export interface User {
  name: string
  email: string
  token: string
  role: string
  photo: string
  backendToken: string
}

export interface SessionContextValue {
  user: User | null | undefined
  onLogin: (user: User) => void
  onLogout: () => void
}
