"use client";

import { useMemo, useState } from "react";

import type { DatabaseConnectionListDto } from "@repo/shared/types";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useDatabaseConnections } from "../hooks";

import { getDatabaseConnectionColumns } from "./columns";
import { DatabaseConnectionCreateModal } from "./database-connection-create-modal";
import { DatabaseConnectionEditModal } from "./database-connection-edit-modal";
import { DatabaseConnectionViewModal } from "./database-connection-view-modal";

export function DatabaseConnectionPanel() {
  const [createOpen, setCreateOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);

  const [viewOpen, setViewOpen] = useState(false);

  const [selectedConnection, setSelectedConnection] =
    useState<DatabaseConnectionListDto | null>(null);

  const connections = useDatabaseConnections();

  const handleEdit = (connection: DatabaseConnectionListDto) => {
    setSelectedConnection(connection);
    setEditOpen(true);
  };

  const handleView = (connection: DatabaseConnectionListDto) => {
    setSelectedConnection(connection);
    setViewOpen(true);
  };

  const columns = useMemo(
    () =>
      getDatabaseConnectionColumns({
        onEdit: handleEdit,
        onView: handleView,
      }),
    [],
  );

  const table = useReactTable({
    data: connections.data ?? [],

    columns,

    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-h2 font-semibold text-ink">
              Database Connections
            </h1>

            <p className="mt-1 text-body text-gray-600">
              Connect Source Agent to your databases.
            </p>
          </div>

          <Button onClick={() => setCreateOpen(true)}>Add connection</Button>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border bg-white">
          {connections.isLoading ? (
            <div className="flex h-48 items-center justify-center text-sm text-gray-500">
              Loading connections...
            </div>
          ) : connections.isError ? (
            <div className="flex h-48 items-center justify-center text-sm text-error">
              Unable to load database connections.
            </div>
          ) : (
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-32 text-center"
                    >
                      <div className="space-y-2">
                        <p className="font-medium">No database connections</p>

                        <p className="text-sm text-gray-500">
                          Add your first database connection to get started.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Create */}
      <DatabaseConnectionCreateModal
        open={createOpen}
        onOpenChange={setCreateOpen}
      />

      {/* Edit */}
      <DatabaseConnectionEditModal
        open={editOpen}
        onOpenChange={setEditOpen}
        connectionId={selectedConnection?.id ?? null}
      />

      {/* View */}
      <DatabaseConnectionViewModal
        open={viewOpen}
        onOpenChange={setViewOpen}
        connectionId={selectedConnection?.id ?? null}
      />
    </>
  );
}
