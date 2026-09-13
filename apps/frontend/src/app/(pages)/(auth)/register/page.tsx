"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { UserRole } from "@repo/db/enums";
import { registerSchema, type RegisterInput } from "@repo/shared/validations";

import GoogleButton from "@/features/auth/component/GoogleButton";
import { REGISTER_COPY } from "@/features/auth/constants";
import { useRegister } from "@/features/auth/hooks";
import { LOGIN_ROUTE, postAuthPath } from "@/features/auth/routes";
import { useZodForm } from "@/lib/form";
import { toast } from "@/lib/toast";

export default function RegisterPage() {
  const router = useRouter();
  const register = useRegister();

  const form = useZodForm({
    schema: registerSchema,
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: UserRole.USER,
    },
  });

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = handleSubmit((values: RegisterInput) => {
    register.mutate(values, {
      onSuccess: () => {
        toast.success("Account created successfully");
        router.push(postAuthPath());
        router.refresh();
      },
      onError: (error) => {
        toast.apiError(error, "Unable to create account right now.");
      },
    });
  });

  const isSubmitting = register.isPending;

  return (
    <>
      <div className="space-y-1.5">
        <h1 className="text-h2 font-semibold text-ink">
          {REGISTER_COPY.title}
        </h1>
        <p className="text-body text-muted-foreground">{REGISTER_COPY.subtitle}</p>
      </div>

      <form className="mt-7 space-y-5" onSubmit={onSubmit} noValidate>
        <div className="space-y-2">
          <Label htmlFor="name" className="text-body-emphasis text-ink">
            Name
          </Label>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Ada Lovelace"
            aria-invalid={Boolean(errors.name)}
            className="h-11"
            {...registerField("name")}
          />
          {errors.name?.message ? (
            <p className="text-caption text-error">{errors.name.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-body-emphasis text-ink">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            aria-invalid={Boolean(errors.email)}
            className="h-11"
            {...registerField("email")}
          />
          {errors.email?.message ? (
            <p className="text-caption text-error">{errors.email.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-body-emphasis text-ink">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 6 characters"
            aria-invalid={Boolean(errors.password)}
            className="h-11"
            {...registerField("password")}
          />
          {errors.password?.message ? (
            <p className="text-caption text-error">{errors.password.message}</p>
          ) : null}
        </div>

        <Button
          type="submit"
          size="lg"
          className="h-11 w-full rounded-xl text-body-emphasis font-semibold"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Creating account
            </>
          ) : (
            "Create account"
          )}
        </Button>

        <div className="flex items-center gap-3 py-0.5">
          <Separator className="flex-1" />
          <span className="text-caption text-muted-foreground">or</span>
          <Separator className="flex-1" />
        </div>

        <GoogleButton />

        <p className="pt-1 text-center text-body text-muted-foreground">
          Already have an account?{" "}
          <Link
            href={LOGIN_ROUTE}
            className="font-medium text-primary transition-colors hover:text-primary/80"
          >
            Sign in
          </Link>
        </p>
      </form>
    </>
  );
}
