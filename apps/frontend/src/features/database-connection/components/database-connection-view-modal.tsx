"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { DatabaseConnectionType } from "@repo/db/enums";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useDatabaseConnection } from "../hooks";
import { getDatabaseConnectionTypeLabel } from "../constants";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connectionId: string | null;
};

export function DatabaseConnectionViewModal({
  open,
  onOpenChange,
  connectionId,
}: Props) {
  const [showCredentials, setShowCredentials] = useState(false);

  const connection = useDatabaseConnection(connectionId ?? "");

  const data = connection.data;

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      setShowCredentials(false);
    }

    onOpenChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-135">
        <DialogHeader>
          <DialogTitle>Database connection</DialogTitle>

          <DialogDescription>
            View the configuration for this database connection.
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
        ) : data ? (
          <div className="space-y-6">
            {/* Basic information */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <InfoItem label="Name" value={data.name} />

              <InfoItem
                label="Connection type"
                value={getDatabaseConnectionTypeLabel(data.connectionType)}
              />

              <InfoItem label="SSL" value={data.ssl ? "Enabled" : "Disabled"} />

              <InfoItem
                label="Status"
                value={data.isActive ? "Active" : "Inactive"}
              />
            </div>

            {/* Credentials */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Connection details</p>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-2"
                  onClick={() => setShowCredentials((current) => !current)}
                >
                  {showCredentials ? (
                    <>
                      <EyeOff className="size-4" />
                      Hide
                    </>
                  ) : (
                    <>
                      <Eye className="size-4" />
                      Show
                    </>
                  )}
                </Button>
              </div>

              <div className="rounded-lg border bg-muted/40 p-4">
                {data.connectionType === DatabaseConnectionType.URL ? (
                  <URLCredentials
                    url={data.credentials.url}
                    visible={showCredentials}
                  />
                ) : (
                  <FieldsCredentials
                    credentials={data.credentials}
                    visible={showCredentials}
                  />
                )}
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function URLCredentials({ url, visible }: { url: string; visible: boolean }) {
  return (
    <DetailRow
      label="Database URL"
      value={visible ? url : maskSecret(url)}
      monospace
    />
  );
}

function FieldsCredentials({
  credentials,
  visible,
}: {
  credentials: {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
  };
  visible: boolean;
}) {
  return (
    <div className="space-y-4">
      <DetailRow label="Host" value={credentials.host} />

      <DetailRow label="Port" value={String(credentials.port)} />

      <DetailRow label="Database" value={credentials.database} />

      <DetailRow label="Username" value={credentials.username} />

      <DetailRow
        label="Password"
        value={
          visible ? credentials.password : maskSecret(credentials.password)
        }
        monospace
      />
    </div>
  );
}

function DetailRow({
  label,
  value,
  monospace = false,
}: {
  label: string;
  value: string;
  monospace?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-caption text-gray-500">{label}</p>

      <div
        className={["break-all text-sm", monospace ? "font-mono" : ""].join(
          " ",
        )}
      >
        {value}
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-caption text-gray-500">{label}</p>

      <p className="text-body-emphasis">{value}</p>
    </div>
  );
}

function maskSecret(value: string) {
  if (!value) {
    return "Not configured";
  }

  return "•".repeat(Math.min(Math.max(value.length, 12), 32));
}
