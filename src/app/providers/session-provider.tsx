import { SessionContext, useSessionState } from "@/entities/session"

type SessionProviderProps = {
  children: React.ReactNode
}

const SessionProvider = ({ children }: SessionProviderProps) => (
  <SessionContext.Provider value={useSessionState()}>
    {children}
  </SessionContext.Provider>
)

export default SessionProvider
