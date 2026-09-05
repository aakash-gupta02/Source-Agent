import { toast as sonnerToast } from "sonner";

import { isApiError } from "@/lib/api/client";

export const toast = {
  success(message: string, description?: string) {
    return sonnerToast.success(message, { description });
  },

  error(message: string, description?: string) {
    return sonnerToast.error(message, { description });
  },

  info(message: string, description?: string) {
    return sonnerToast.info(message, { description });
  },

  warning(message: string, description?: string) {
    return sonnerToast.warning(message, { description });
  },

  apiError(error: unknown, fallback = "Something went wrong") {
    if (isApiError(error)) return sonnerToast.error(error.message);
    if (error instanceof Error) return sonnerToast.error(error.message);
    return sonnerToast.error(fallback);
  },

  promise: sonnerToast.promise,
  dismiss: sonnerToast.dismiss,
};
