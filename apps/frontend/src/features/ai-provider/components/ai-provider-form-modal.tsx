"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { AIProviderType } from "@repo/db/enums";

import { z } from "zod";

import {
  aiProvider as aiProviderFields,
  type CreateAIProviderInput,
  type UpdateAIProviderInput,
} from "@repo/shared/validations";

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

import { useZodForm } from "@/lib/form";
import { toast } from "@/lib/toast";

import { AI_PROVIDER_OPTIONS } from "../constants";
import { useCreateAIProvider, useUpdateAIProvider } from "../hooks";

/**
 * Describes the fields the modal renders, which is not the same shape as the
 * API payloads: `provider` is display-only when editing, and a blank
 * `credentials` means "keep the stored key". Both variants infer to the same
 * TypeScript shape so the form stays strongly typed across modes.
 */
const formFields = {
  name: aiProviderFields.name,
  provider: aiProviderFields.provider,
  model: aiProviderFields.model,
  isActive: aiProviderFields.isActive,
};

const createFormSchema = z.object({
  ...formFields,
  credentials: aiProviderFields.credentials,
});

const editFormSchema = z.object({
  ...formFields,
  credentials: z.string().trim(),
});

type AIProviderFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  mode: "create" | "edit";

  provider?: {
    id: string;
    name: string;
    provider: AIProviderType;
    model: string;
    isActive: boolean;
  };
};

export function AIProviderFormModal({
  open,
  onOpenChange,
  mode,
  provider,
}: AIProviderFormModalProps) {
  const isEdit = mode === "edit";

  const createProvider = useCreateAIProvider();

  const updateProvider = useUpdateAIProvider(provider?.id ?? "");

  const form = useZodForm({
    schema: isEdit ? editFormSchema : createFormSchema,

    defaultValues: {
      name: provider?.name ?? "",
      provider: provider?.provider ?? AIProviderType.OPENAI,
      credentials: "",
      model: provider?.model ?? "",
      isActive: provider?.isActive ?? true,
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, dirtyFields, isDirty },
  } = form;

  const selectedProvider = watch("provider");
  const isActive = watch("isActive");

  useEffect(() => {
    if (!open) return;

    reset({
      name: provider?.name ?? "",
      provider: provider?.provider ?? AIProviderType.OPENAI,
      credentials: "",
      model: provider?.model ?? "",
      isActive: provider?.isActive ?? true,
    });
  }, [open, provider, reset]);

  const isPending = createProvider.isPending || updateProvider.isPending;

  const onSubmit = handleSubmit((values) => {
    if (isEdit && provider) {
      // `provider` is intentionally omitted: the update endpoint is strict and
      // rejects it.
      const updatePayload: UpdateAIProviderInput = {};

      if (dirtyFields.name) {
        updatePayload.name = values.name;
      }

      if (dirtyFields.model) {
        updatePayload.model = values.model;
      }

      if (dirtyFields.isActive) {
        updatePayload.isActive = values.isActive;
      }

      if (dirtyFields.credentials && values.credentials) {
        updatePayload.credentials = values.credentials;
      }

      if (Object.keys(updatePayload).length === 0) {
        onOpenChange(false);
        return;
      }

      updateProvider.mutate(updatePayload, {
        onSuccess: () => {
          toast.success("AI provider updated successfully");

          onOpenChange(false);
        },

        onError: (error) => {
          toast.apiError(error, "Unable to update AI provider.");
        },
      });

      return;
    }

    const createPayload: CreateAIProviderInput = values;

    createProvider.mutate(createPayload, {
      onSuccess: () => {
        toast.success("AI provider created successfully");

        onOpenChange(false);
        reset();
      },

      onError: (error) => {
        toast.apiError(error, "Unable to create AI provider.");
      },
    });
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit AI provider" : "Add AI provider"}
          </DialogTitle>

          <DialogDescription>
            {isEdit
              ? "Update the configuration for this AI provider."
              : "Configure an AI provider to use with Source Agent."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="provider-name" className="text-body-emphasis">
              Name
            </Label>

            <Input
              id="provider-name"
              placeholder="My OpenAI"
              aria-invalid={Boolean(errors.name)}
              {...register("name")}
            />

            {errors.name?.message && (
              <p className="text-caption text-error">{errors.name.message}</p>
            )}
          </div>

          {/* Provider */}
          <div className="space-y-2">
            <Label htmlFor="provider" className="text-body-emphasis">
              Provider
            </Label>

            {isEdit ? (
              <Input
                value={
                  AI_PROVIDER_OPTIONS.find(
                    (option) => option.value === selectedProvider,
                  )?.label ?? selectedProvider
                }
                disabled
              />
            ) : (
              <Select
                value={selectedProvider}
                onValueChange={(value) =>
                  setValue("provider", value as AIProviderType, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              >
                <SelectTrigger
                  id="provider"
                  className="w-full"
                  aria-invalid={Boolean(errors.provider)}
                >
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>

                <SelectContent>
                  {AI_PROVIDER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {errors.provider?.message && (
              <p className="text-caption text-error">
                {errors.provider.message}
              </p>
            )}
          </div>

          {/* Model */}
          <div className="space-y-2">
            <Label htmlFor="provider-model" className="text-body-emphasis">
              Model
            </Label>

            <Input
              id="provider-model"
              placeholder="gpt-4o-mini"
              aria-invalid={Boolean(errors.model)}
              {...register("model")}
            />

            {errors.model?.message && (
              <p className="text-caption text-error">{errors.model.message}</p>
            )}
          </div>

          {/* Credentials */}
          <div className="space-y-2">
            <Label
              htmlFor="provider-credentials"
              className="text-body-emphasis"
            >
              {isEdit ? "API credentials" : "API credentials"}
            </Label>

            <Input
              id="provider-credentials"
              type="password"
              placeholder={isEdit ? "Enter new credentials" : "Enter API key"}
              aria-invalid={Boolean(errors.credentials)}
              {...register("credentials")}
            />

            {errors.credentials?.message && (
              <p className="text-caption text-error">
                {errors.credentials.message}
              </p>
            )}

            {isEdit && (
              <p className="text-caption text-gray-500">
                Leave empty to keep the existing credentials.
              </p>
            )}
          </div>

          {/* Active */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-1">
              <Label htmlFor="provider-active" className="text-body-emphasis">
                Active
              </Label>

              <p className="text-caption text-gray-500">
                Allow Source Agent to use this provider.
              </p>
            </div>

            <Switch
              id="provider-active"
              checked={isActive}
              onCheckedChange={(checked) =>
                setValue("isActive", checked, {
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

            <Button type="submit" disabled={isPending || (isEdit && !isDirty)}>
              {isPending && <Loader2 className="size-4 animate-spin" />}

              {isEdit ? "Save changes" : "Add provider"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
