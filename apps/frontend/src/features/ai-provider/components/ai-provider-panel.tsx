"use client";

import { useMemo, useState } from "react";

import type { AIProviderListDto } from "@repo/shared/types";

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

import { useAIProviders } from "../hooks";

import { getAIProviderColumns } from "./columns";
import { AIProviderFormModal } from "./ai-provider-form-modal";
import { AIProviderViewModal } from "./ai-provider-view-modal";

export function AIProviderPanel() {
  const [formOpen, setFormOpen] =
    useState(false);

  const [viewOpen, setViewOpen] =
    useState(false);

  const [formMode, setFormMode] = useState<
    "create" | "edit"
  >("create");

  const [selectedProvider, setSelectedProvider] =
    useState<AIProviderListDto | null>(null);

  const providers = useAIProviders();

  const handleCreate = () => {
    setSelectedProvider(null);
    setFormMode("create");
    setFormOpen(true);
  };

  const handleEdit = (
    provider: AIProviderListDto,
  ) => {
    setSelectedProvider(provider);
    setFormMode("edit");
    setFormOpen(true);
  };

  const handleView = (
    provider: AIProviderListDto,
  ) => {
    setSelectedProvider(provider);
    setViewOpen(true);
  };

  const columns = useMemo(
    () =>
      getAIProviderColumns({
        onView: handleView,
        onEdit: handleEdit,
      }),
    [],
  );

  const table = useReactTable({
    data: providers.data ?? [],
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
              AI Providers
            </h1>

            <p className="mt-1 text-body text-gray-600">
              Configure the AI providers used by Source Agent.
            </p>
          </div>

          <Button onClick={handleCreate}>
            Add provider
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border bg-white">
          {providers.isLoading ? (
            <div className="flex h-48 items-center justify-center text-sm text-gray-500">
              Loading providers...
            </div>
          ) : providers.isError ? (
            <div className="flex h-48 items-center justify-center text-sm text-error">
              Unable to load AI providers.
            </div>
          ) : (
            <Table>
              <TableHeader>
                {table
                  .getHeaderGroups()
                  .map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map(
                        (header) => (
                          <TableHead
                            key={header.id}
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column
                                    .columnDef.header,
                                  header.getContext(),
                                )}
                          </TableHead>
                        ),
                      )}
                    </TableRow>
                  ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows.length ? (
                  table
                    .getRowModel()
                    .rows.map((row) => (
                      <TableRow
                        key={row.id}
                      >
                        {row
                          .getVisibleCells()
                          .map((cell) => (
                            <TableCell
                              key={cell.id}
                            >
                              {flexRender(
                                cell.column
                                  .columnDef.cell,
                                cell.getContext(),
                              )}
                            </TableCell>
                          ))}
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={
                        columns.length
                      }
                      className="h-32 text-center"
                    >
                      <div className="space-y-2">
                        <p className="font-medium">
                          No AI providers
                        </p>

                        <p className="text-sm text-gray-500">
                          Add your first AI provider
                          to get started.
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

      {/* Create / Edit */}
      <AIProviderFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        provider={
          selectedProvider
            ? {
                id: selectedProvider.id,
                name: selectedProvider.name,
                provider:
                  selectedProvider.provider,
                model: selectedProvider.model,
                isActive:
                  selectedProvider.isActive,
              }
            : undefined
        }
      />

      {/* View */}
      <AIProviderViewModal
        open={viewOpen}
        onOpenChange={setViewOpen}
        providerId={
          selectedProvider?.id ?? null
        }
      />
    </>
  );
}