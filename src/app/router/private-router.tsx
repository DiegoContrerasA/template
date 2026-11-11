import { Navigate, Outlet } from "react-router"
import AppLayout from "@/app/layouts/app-layout"
import { useSession } from "@/entities/session"

const PrivateRoute = () => {
  const { user } = useSession()

  if (user === undefined) {
    return <p>Loading ...</p>
  }

  if (!user?.token) return <Navigate to="/auth/login" />

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
}

export default PrivateRoute
