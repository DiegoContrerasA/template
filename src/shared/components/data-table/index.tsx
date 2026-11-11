import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Skeleton } from "@/shared/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"
import { cn } from "@/shared/lib/utils"
import type {
  DataTableClassNames,
  DataTableColumn,
  DataTablePagination,
} from "./types"

type DataTableProps<T> = {
  columns: DataTableColumn<T>[]
  data: T[]
  getRowKey: (row: T) => string | number
  isLoading?: boolean
  skeletonRows?: number
  emptyMessage?: string
  pagination?: DataTablePagination
  classNames?: DataTableClassNames
}

const DataTable = <T,>({
  columns,
  data,
  getRowKey,
  isLoading = false,
  skeletonRows = 5,
  emptyMessage = "No data.",
  pagination,
  classNames,
}: DataTableProps<T>) => (
  <div className={cn("flex flex-col gap-3", classNames?.root)}>
    <div className="rounded-lg border">
      <Table>
        <TableHeader className={classNames?.header}>
          <TableRow className="hover:bg-transparent">
            {columns.map((column) => (
              <TableHead key={column.key} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading &&
            Array.from({ length: skeletonRows }, (_, i) => (
              <TableRow key={i} className={classNames?.row}>
                {columns.map((column) => (
                  <TableCell key={column.key} className={classNames?.cell}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}

          {!isLoading && data.length === 0 && (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={columns.length}
                className={cn(
                  "h-24 text-center text-muted-foreground",
                  classNames?.empty,
                )}
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}

          {!isLoading &&
            data.map((row) => (
              <TableRow key={getRowKey(row)} className={classNames?.row}>
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={cn(classNames?.cell, column.className)}
                  >
                    {column.cell
                      ? column.cell(row)
                      : String(
                          (row as Record<string, unknown>)[column.key] ?? "",
                        )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>

    {pagination && pagination.pageCount > 1 && (
      <div
        className={cn(
          "flex items-center justify-end gap-2",
          classNames?.pagination,
        )}
      >
        <span className="text-sm text-muted-foreground">
          Page {pagination.page} of {pagination.pageCount}
        </span>
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Previous page"
          disabled={pagination.page <= 1}
          onClick={() => pagination.onPageChange(pagination.page - 1)}
        >
          <ChevronLeftIcon />
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Next page"
          disabled={pagination.page >= pagination.pageCount}
          onClick={() => pagination.onPageChange(pagination.page + 1)}
        >
          <ChevronRightIcon />
        </Button>
      </div>
    )}
  </div>
)

export default DataTable
export type { DataTableClassNames, DataTableColumn, DataTablePagination }
