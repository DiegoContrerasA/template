import type { ReactNode } from "react"

export type DataTableColumn<T> = {
  key: string
  header: ReactNode
  /** Custom cell renderer; defaults to `row[key]`. */
  cell?: (row: T) => ReactNode
  className?: string
}

export type DataTablePagination = {
  /** 1-based current page. */
  page: number
  pageCount: number
  onPageChange: (page: number) => void
}

/** Per-slot class overrides, same idea as the form fields' `classNames`. */
export type DataTableClassNames = {
  root?: string
  header?: string
  row?: string
  cell?: string
  empty?: string
  pagination?: string
}
