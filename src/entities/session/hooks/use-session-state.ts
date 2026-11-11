import { useCallback, useEffect, useState } from "react"
import { storageKeys } from "@/shared/config/storage-keys"
import { storage } from "@/shared/lib/storage"
import type { SessionContextValue, User } from "../types/session.types"

export const useSessionState = (): SessionContextValue => {
  const [user, setUser] = useState<User | null | undefined>(undefined)

  useEffect(() => {
    setUser(storage.get<User>(storageKeys.user))
  }, [])

  const onLogin = useCallback((user: User) => {
    setUser(user)
    storage.set(storageKeys.user, user)
    storage.set(storageKeys.accessToken, user.backendToken)
  }, [])

  const onLogout = useCallback(() => {
    setUser(null)
    storage.clear()
  }, [])

  return { user, onLogin, onLogout }
}
