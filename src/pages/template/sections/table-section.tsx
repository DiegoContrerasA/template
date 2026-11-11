import { useState } from "react"

import DataTable, { type DataTableColumn } from "@/shared/components/data-table"
import Section from "../section"

type User = { id: number; name: string; role: string }

const USERS: User[] = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  role: i % 2 ? "Admin" : "Member",
}))

const PAGE_SIZE = 5

const COLUMNS: DataTableColumn<User>[] = [
  { key: "id", header: "ID", className: "w-16" },
  { key: "name", header: "Name" },
  {
    key: "role",
    header: "Role",
    cell: (user) => <span className="font-medium">{user.role}</span>,
  },
]

const TableSection = () => {
  const [page, setPage] = useState(1)

  return (
    <Section title="Data table" description="Data, empty and loading states.">
      <DataTable
        columns={COLUMNS}
        data={USERS.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)}
        getRowKey={(user) => user.id}
        pagination={{
          page,
          pageCount: Math.ceil(USERS.length / PAGE_SIZE),
          onPageChange: setPage,
        }}
      />
      <DataTable columns={COLUMNS} data={[]} getRowKey={(u) => u.id} />
      <DataTable
        columns={COLUMNS}
        data={[]}
        getRowKey={(u) => u.id}
        isLoading
        skeletonRows={2}
      />
    </Section>
  )
}

export default TableSection
