"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { getAIProviderLabel } from "../constants";
import { useAIProvider } from "../hooks";

type AIProviderViewModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  providerId: string | null;
};

export function AIProviderViewModal({
  open,
  onOpenChange,
  providerId,
}: AIProviderViewModalProps) {
  const [showCredentials, setShowCredentials] =
    useState(false);

  const provider = useAIProvider(
    providerId ?? "",
  );

  const data = provider.data;

  const maskedCredentials =
    data?.credentials
      ? "•".repeat(20)
      : "Not configured";

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          setShowCredentials(false);
        }

        onOpenChange(value);
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            AI provider
          </DialogTitle>

          <DialogDescription>
            View the configuration for this provider.
          </DialogDescription>
        </DialogHeader>

        {provider.isLoading ? (
          <div className="flex min-h-[180px] items-center justify-center">
            <Loader2 className="size-5 animate-spin text-gray-500" />
          </div>
        ) : provider.isError ? (
          <div className="py-8 text-center text-sm text-error">
            Unable to load provider details.
          </div>
        ) : data ? (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <InfoItem
                label="Name"
                value={data.name}
              />

              <InfoItem
                label="Provider"
                value={getAIProviderLabel(data.provider)}
              />

              <InfoItem
                label="Model"
                value={data.model}
              />

              <InfoItem
                label="Status"
                value={
                  data.isActive
                    ? "Active"
                    : "Inactive"
                }
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                  Credentials
                </p>

                {data.credentials && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-2"
                    onClick={() =>
                      setShowCredentials(
                        (current) => !current,
                      )
                    }
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
                )}
              </div>

              <div className="rounded-lg border bg-muted/40 px-3 py-2.5">
                <code className="break-all text-sm">
                  {showCredentials
                    ? data.credentials
                    : maskedCredentials}
                </code>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-1">
      <p className="text-caption text-gray-500">
        {label}
      </p>

      <p className="text-body-emphasis">
        {value}
      </p>
    </div>
  );
}