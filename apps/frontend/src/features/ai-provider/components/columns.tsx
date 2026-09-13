"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Eye } from "lucide-react";

import type { AIProviderListDto } from "@repo/shared/types";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { getAIProviderLabel } from "../constants";

type AIProviderColumnsProps = {
  onView: (provider: AIProviderListDto) => void;
  onEdit: (provider: AIProviderListDto) => void;
};

export function getAIProviderColumns({
  onView,
  onEdit,
}: AIProviderColumnsProps): ColumnDef<AIProviderListDto>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",

      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.name}
        </div>
      ),
    },

    {
      accessorKey: "provider",
      header: "Provider",

      cell: ({ row }) =>
        getAIProviderLabel(row.original.provider),
    },

    {
      accessorKey: "model",
      header: "Model",

      cell: ({ row }) => (
        <code className="text-sm text-muted-foreground">
          {row.original.model}
        </code>
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
                : "inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
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
        const provider = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                />
              }
            >
              <MoreHorizontal className="size-4" />
              <span className="sr-only">Open actions</span>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onView(provider)}
              >
                <Eye className="size-4" />
                View
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onEdit(provider)}
              >
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