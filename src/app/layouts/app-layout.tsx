import { useSession } from "@/entities/session"

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { onLogout } = useSession()

  const handleLogout = () => {
    onLogout()
  }

  return (
    <div className="w-full">
      <nav className="w-full flex justify-end h-20 border-b border-gray-200 bg-white px-4">
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </nav>
      {children}
    </div>
  )
}

export default AppLayout
