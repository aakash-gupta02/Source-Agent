"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Eye, MoreHorizontal, Pencil } from "lucide-react";

import type { DatabaseConnectionListDto } from "@repo/shared/types";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { getDatabaseConnectionTypeLabel } from "../constants";

type Props = {
  onEdit: (connection: DatabaseConnectionListDto) => void;

  onView: (connection: DatabaseConnectionListDto) => void;
};

export function getDatabaseConnectionColumns({
  onEdit,
  onView,
}: Props): ColumnDef<DatabaseConnectionListDto>[] {
  return [
    {
      accessorKey: "name",

      header: "Name",

      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },

    {
      accessorKey: "connectionType",

      header: "Connection",

      cell: ({ row }) =>
        getDatabaseConnectionTypeLabel(row.original.connectionType),
    },

    {
      accessorKey: "ssl",

      header: "SSL",

      cell: ({ row }) => (
        <span className="text-sm text-gray-600">
          {row.original.ssl ? "Enabled" : "Disabled"}
        </span>
      ),
    },

    {
      accessorKey: "isActive",

      header: "Status",

      cell: ({ row }) => {
        const active = row.original.isActive;

        return (
          <span
            className={
              active
                ? "inline-flex rounded-full bg-success-tint px-2.5 py-1 text-xs font-medium text-success"
                : "inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600"
            }
          >
            {active ? "Active" : "Inactive"}
          </span>
        );
      },
    },

    {
      id: "actions",

      enableSorting: false,
      enableHiding: false,
      header: "Actions",

      cell: ({ row }) => {
        const connection = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon" className="size-8">
                  <MoreHorizontal className="size-4" />

                  <span className="sr-only">Open actions</span>
                </Button>
              }
            />

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(connection)}>
                <Eye className="size-4" />
                View
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => onEdit(connection)}>
                <Pencil className="size-4" />
                Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
