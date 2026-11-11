import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios"
import { storageKeys } from "@/shared/config/storage-keys"
import { storage } from "@/shared/lib/storage"

export const fetcher = async <T = unknown, K = unknown>(
  url: string,
  data?: T,
  options: AxiosRequestConfig = {},
): Promise<K> => {
  const token = storage.get<string>(storageKeys.accessToken)
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {}

  try {
    const response: AxiosResponse<K> = await axios({
      baseURL: import.meta.env.VITE_APP_BASE_URL,
      url,
      data,
      timeout: 20000,
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
        ...options.headers,
      },
      ...options,
    })

    return response.data
  } catch (error: unknown) {
    const axiosError = error as AxiosError
    if (axiosError?.response?.status === 401) {
      storage.clear()
      window.location.replace("/auth/login?sessionExpired=true")
      return new Promise(() => {}) // nunca resuelve para evitar errores adicionales
    }

    return Promise.reject(error)
  }
}

export type FetchError = AxiosError
