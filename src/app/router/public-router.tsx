import { Navigate, Outlet } from "react-router"
import AuthLayout from "@/app/layouts/auth-layout"
import { useSession } from "@/entities/session"

const PublicRoute = () => {
  const { user } = useSession()

  if (user === undefined) return null

  if (user?.token) return <Navigate to="/" />

  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  )
}

export default PublicRoute
