"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { DatabaseConnectionType } from "@repo/db/enums";

import {
  createConnectionFormSchema,
  toCreatePayload,
} from "../form-schema";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import { fieldMessage, useZodForm } from "@/lib/form";
import { toast } from "@/lib/toast";

import { DATABASE_CONNECTION_TYPE_OPTIONS } from "../constants";
import { useCreateDatabaseConnection } from "../hooks";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DatabaseConnectionCreateModal({ open, onOpenChange }: Props) {
  const createConnection = useCreateDatabaseConnection();

  const [connectionType, setConnectionType] = useState<DatabaseConnectionType>(
    DatabaseConnectionType.URL,
  );

  const form = useZodForm({
    schema: createConnectionFormSchema,

    defaultValues: {
      name: "",
      connectionType: DatabaseConnectionType.URL,
      url: "",
      host: "",
      port: "",
      database: "",
      username: "",
      password: "",
      ssl: true,
      isActive: true,
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = form;

  const selectedType = watch("connectionType");
  const ssl = watch("ssl");

  const isPending = createConnection.isPending;

  const onSubmit = handleSubmit((values) => {
    createConnection.mutate(toCreatePayload(values), {
      onSuccess: () => {
        toast.success("Database connection created successfully");

        reset();

        setConnectionType(DatabaseConnectionType.URL);

        onOpenChange(false);
      },

      onError: (error) => {
        toast.apiError(error, "Unable to create database connection.");
      },
    });
  });

  const handleConnectionTypeChange = (value: "URL" | "FIELDS" | null) => {
    if (!value) return;

    setConnectionType(value as DatabaseConnectionType);

    setValue("connectionType", value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-135">
        <DialogHeader>
          <DialogTitle>Add database connection</DialogTitle>

          <DialogDescription>
            Connect Source Agent to your PostgreSQL database.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} noValidate className="space-y-5">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="connection-name">Name</Label>

            <Input
              id="connection-name"
              placeholder="Production database"
              aria-invalid={Boolean(errors.name)}
              {...register("name")}
            />

            {fieldMessage(errors.name) && (
              <p className="text-caption text-error">
                {fieldMessage(errors.name)}
              </p>
            )}
          </div>

          {/* Connection type */}
          <div className="space-y-2">
            <Label>Connection type</Label>

            <Select
              value={selectedType}
              onValueChange={handleConnectionTypeChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {DATABASE_CONNECTION_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {fieldMessage(errors.connectionType) && (
              <p className="text-caption text-error">
                {fieldMessage(errors.connectionType)}
              </p>
            )}
          </div>

          {connectionType === DatabaseConnectionType.URL ? (
            <div className="space-y-2">
              <Label htmlFor="connection-url">Database URL</Label>

              <Input
                id="connection-url"
                placeholder="postgresql://user:password@host:5432/database"
                aria-invalid={Boolean(errors.url)}
                {...register("url")}
              />


              {fieldMessage(errors.url) && (
                <p className="text-caption text-error">
                  {fieldMessage(errors.url)}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Host */}
              <div className="space-y-2">
                <Label htmlFor="connection-host">Host</Label>

                <Input
                  id="connection-host"
                  placeholder="localhost"
                  aria-invalid={Boolean(errors.host)}
                  {...register("host")}
                />

                {fieldMessage(errors.host) && (
                  <p className="text-caption text-error">
                    {fieldMessage(errors.host)}
                  </p>
                )}
              </div>

              {/* Port */}
              <div className="space-y-2">
                <Label htmlFor="connection-port">Port</Label>

                <Input
                  id="connection-port"
                  type="number"
                  placeholder="5432"
                  aria-invalid={Boolean(errors.port)}
                  {...register("port")}
                />

                {fieldMessage(errors.port) && (
                  <p className="text-caption text-error">
                    {fieldMessage(errors.port)}
                  </p>
                )}
              </div>

              {/* Database */}
              <div className="space-y-2">
                <Label htmlFor="connection-database">Database</Label>

                <Input
                  id="connection-database"
                  placeholder="my_database"
                  aria-invalid={Boolean(errors.database)}
                  {...register("database")}
                />

                {fieldMessage(errors.database) && (
                  <p className="text-caption text-error">
                    {fieldMessage(errors.database)}
                  </p>
                )}
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="connection-username">Username</Label>

                <Input
                  id="connection-username"
                  placeholder="postgres"
                  aria-invalid={Boolean(errors.username)}
                  {...register("username")}
                />

                {fieldMessage(errors.username) && (
                  <p className="text-caption text-error">
                    {fieldMessage(errors.username)}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="connection-password">Password</Label>

                <Input
                  id="connection-password"
                  type="password"
                  placeholder="Database password"
                  aria-invalid={Boolean(errors.password)}
                  {...register("password")}
                />

                {fieldMessage(errors.password) && (
                  <p className="text-caption text-error">
                    {fieldMessage(errors.password)}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* SSL */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-1">
              <Label htmlFor="connection-ssl">SSL</Label>

              <p className="text-caption text-gray-500">
                Use an encrypted connection to the database.
              </p>
            </div>

            <Switch
              id="connection-ssl"
              checked={ssl}
              onCheckedChange={(checked) =>
                setValue("ssl", checked, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="size-4 animate-spin" />}
              Add connection
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
