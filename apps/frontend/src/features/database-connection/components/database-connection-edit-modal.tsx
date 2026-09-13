"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";

import { DatabaseConnectionType } from "@repo/db/enums";

import type {
  UpdateDatabaseConnectionInput,
} from "@repo/shared/validations";

import { editConnectionFormSchema } from "../form-schema";

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
import { Switch } from "@/components/ui/switch";

import { useZodForm } from "@/lib/form";
import { toast } from "@/lib/toast";

import {
  getDatabaseConnectionTypeLabel,
} from "../constants";

import {
  useDatabaseConnection,
  useUpdateDatabaseConnection,
} from "../hooks";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connectionId: string | null;
};

export function DatabaseConnectionEditModal({
  open,
  onOpenChange,
  connectionId,
}: Props) {
  const connection = useDatabaseConnection(
    connectionId ?? "",
  );

  const updateConnection =
    useUpdateDatabaseConnection(
      connectionId ?? "",
    );

  const form = useZodForm({
    schema: editConnectionFormSchema,

    defaultValues: {
      name: "",
      connectionType:
        DatabaseConnectionType.URL,
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
    reset,
    setValue,
    watch,
    formState: {
      errors,
      dirtyFields,
      isDirty,
    },
  } = form;

  const connectionType =
    watch("connectionType");

  const ssl = watch("ssl");
  const isActive = watch("isActive");

  useEffect(() => {
    const data = connection.data;

    if (!open || !data) {
      return;
    }

    if (
      data.connectionType ===
      DatabaseConnectionType.URL
    ) {
      reset({
        name: data.name,
        connectionType: data.connectionType,
        url: data.credentials.url,
        host: "",
        port: "",
        database: "",
        username: "",
        password: "",
        ssl: data.ssl,
        isActive: data.isActive,
      });

      return;
    }

    reset({
      name: data.name,
      connectionType: data.connectionType,
      url: "",
      host: data.credentials.host,
      port: String(data.credentials.port),
      database: data.credentials.database,
      username: data.credentials.username,
      password: "",
      ssl: data.ssl,
      isActive: data.isActive,
    });
  }, [
    open,
    connection.data,
    reset,
  ]);

  const isPending =
    connection.isLoading ||
    updateConnection.isPending;

  const onSubmit = handleSubmit((values) => {
      const payload: UpdateDatabaseConnectionInput =
        {};

      /*
       * Only send fields that actually changed.
       */

      if (dirtyFields.name) {
        payload.name = values.name;
      }

      if (dirtyFields.ssl) {
        payload.ssl = values.ssl;
      }

      if (dirtyFields.isActive) {
        payload.isActive =
          values.isActive;
      }

      if (
        values.connectionType ===
        DatabaseConnectionType.URL
      ) {
        if (dirtyFields.url) {
          payload.url = values.url;
        }
      }

      if (
        values.connectionType ===
        DatabaseConnectionType.FIELDS
      ) {
        if (dirtyFields.host) {
          payload.host = values.host;
        }

        if (dirtyFields.port) {
          payload.port = Number(
            values.port,
          );
        }

        if (dirtyFields.database) {
          payload.database =
            values.database;
        }

        if (dirtyFields.username) {
          payload.username =
            values.username;
        }

        if (dirtyFields.password && values.password) {
          payload.password = values.password;
        }
      }

      if (
        Object.keys(payload).length === 0
      ) {
        onOpenChange(false);
        return;
      }

      updateConnection.mutate(payload, {
        onSuccess: () => {
          toast.success(
            "Database connection updated successfully",
          );

          onOpenChange(false);
        },

        onError: (error) => {
          toast.apiError(
            error,
            "Unable to update database connection.",
          );
        },
      });
    },
  );

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-135">
        <DialogHeader>
          <DialogTitle>
            Edit database connection
          </DialogTitle>

          <DialogDescription>
            Update the configuration for this
            database connection.
          </DialogDescription>
        </DialogHeader>

        {connection.isLoading ? (
          <div className="flex min-h-70 items-center justify-center">
            <Loader2 className="size-5 animate-spin text-gray-500" />
          </div>
        ) : connection.isError ? (
          <div className="py-10 text-center text-sm text-error">
            Unable to load database connection.
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            noValidate
            className="space-y-5"
          >
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="edit-connection-name">
                Name
              </Label>

              <Input
                id="edit-connection-name"
                aria-invalid={Boolean(
                  errors.name,
                )}
                {...register("name")}
              />

              {errors.name?.message && (
                <p className="text-caption text-error">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Connection type */}
            <div className="space-y-2">
              <Label>
                Connection type
              </Label>

              <Input
                value={getDatabaseConnectionTypeLabel(
                  connectionType,
                )}
                disabled
              />

              <p className="text-caption text-gray-500">
                Connection type cannot be changed
                after creation.
              </p>
            </div>

            {/* URL */}
            {connectionType ===
              DatabaseConnectionType.URL && (
              <div className="space-y-2">
                <Label htmlFor="edit-connection-url">
                  Database URL
                </Label>

                <Input
                  id="edit-connection-url"
                  placeholder="postgresql://..."
                  aria-invalid={Boolean(
                    errors.url,
                  )}
                  {...register("url")}
                />

                {errors.url?.message && (
                  <p className="text-caption text-error">
                    {errors.url.message}
                  </p>
                )}
              </div>
            )}

            {/* Fields */}
            {connectionType ===
              DatabaseConnectionType.FIELDS && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-host">
                    Host
                  </Label>

                  <Input
                    id="edit-host"
                    aria-invalid={Boolean(
                      errors.host,
                    )}
                    {...register("host")}
                  />

                  {errors.host?.message && (
                    <p className="text-caption text-error">
                      {errors.host.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-port">
                    Port
                  </Label>

                  <Input
                    id="edit-port"
                    type="number"
                    aria-invalid={Boolean(
                      errors.port,
                    )}
                    {...register("port")}
                  />

                  {errors.port?.message && (
                    <p className="text-caption text-error">
                      {errors.port.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-database">
                    Database
                  </Label>

                  <Input
                    id="edit-database"
                    aria-invalid={Boolean(
                      errors.database,
                    )}
                    {...register("database")}
                  />

                  {errors.database?.message && (
                    <p className="text-caption text-error">
                      {errors.database.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-username">
                    Username
                  </Label>

                  <Input
                    id="edit-username"
                    aria-invalid={Boolean(
                      errors.username,
                    )}
                    {...register("username")}
                  />

                  {errors.username?.message && (
                    <p className="text-caption text-error">
                      {errors.username.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-password">
                    Password
                  </Label>

                  <Input
                    id="edit-password"
                    type="password"
                    aria-invalid={Boolean(
                      errors.password,
                    )}
                    {...register("password")}
                  />

                  {errors.password?.message && (
                    <p className="text-caption text-error">
                      {errors.password.message}
                    </p>
                  )}

                  <p className="text-caption text-gray-500">
                    Leave unchanged if you don&apos;t want
                    to update the password.
                  </p>
                </div>
              </div>
            )}

            {/* SSL */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-1">
                <Label htmlFor="edit-ssl">
                  SSL
                </Label>

                <p className="text-caption text-gray-500">
                  Use an encrypted connection to the
                  database.
                </p>
              </div>

              <Switch
                id="edit-ssl"
                checked={ssl}
                onCheckedChange={(checked) =>
                  setValue(
                    "ssl",
                    checked,
                    {
                      shouldValidate: true,
                      shouldDirty: true,
                    },
                  )
                }
              />
            </div>

            {/* Active */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-1">
                <Label htmlFor="edit-active">
                  Active
                </Label>

                <p className="text-caption text-gray-500">
                  Allow Source Agent to use this
                  database connection.
                </p>
              </div>

              <Switch
                id="edit-active"
                checked={isActive}
                onCheckedChange={(checked) =>
                  setValue(
                    "isActive",
                    checked,
                    {
                      shouldValidate: true,
                      shouldDirty: true,
                    },
                  )
                }
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  onOpenChange(false)
                }
                disabled={isPending}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={
                  isPending || !isDirty
                }
              >
                {updateConnection.isPending && (
                  <Loader2 className="size-4 animate-spin" />
                )}

                Save changes
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}