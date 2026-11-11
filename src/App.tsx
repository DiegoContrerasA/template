import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { RouterProvider } from "react-router"

import SessionProvider from "@/app/providers/session-provider"
import { appRouter } from "@/routes"
import { Toaster } from "@/shared/components/ui/sonner"
import "@/shared/lib/i18n/i18n"

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchInterval: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
        retry: 2,
        staleTime: 1000 * 60 * 5, // 5 minutes
      },
      mutations: {
        retry: 2,
      },
    },
  })

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={appRouter} />
        <ReactQueryDevtools initialIsOpen={false} />
        <Toaster richColors position="top-right" />
      </QueryClientProvider>
    </SessionProvider>
  )
}

export default App
