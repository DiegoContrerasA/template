import { createBrowserRouter, Navigate } from "react-router"
import PrivateRoute from "./app/router/private-router"
import PublicRoute from "./app/router/public-router"
import Home from "./pages/home"
import Login from "./pages/login"
import Template from "./pages/template"

export const appRouter = createBrowserRouter([
  {
    path: "/auth",
    element: <PublicRoute />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
  {
    path: "/",
    element: <PrivateRoute />,
    children: [
      {
        index: true,
        element: <Navigate to="/home" />,
      },
      {
        path: "home",
        element: <Home />,
      },
    ],
  },
  {
    path: "/template",
    element: <Template />,
  },
  {
    path: "*",
    element: <p>Page not found</p>,
  },
])
