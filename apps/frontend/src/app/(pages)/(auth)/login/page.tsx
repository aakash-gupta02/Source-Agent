"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { loginSchema, type LoginInput } from "@repo/shared/validations";

import GoogleButton from "@/features/auth/component/GoogleButton";
import { LOGIN_COPY } from "@/features/auth/constants";
import { useLogin } from "@/features/auth/hooks";
import { postAuthPath, REGISTER_ROUTE } from "@/features/auth/routes";
import { useZodForm } from "@/lib/form";
import { toast } from "@/lib/toast";

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();

  const form = useZodForm({
    schema: loginSchema,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = handleSubmit((values: LoginInput) => {
    login.mutate(values, {
      onSuccess: () => {
        toast.success("Welcome back");
        router.push(postAuthPath());
        router.refresh();
      },
      onError: (error) => {
        toast.apiError(error, "Unable to sign in right now.");
      },
    });
  });

  const isSubmitting = login.isPending;

  return (
    <>
      <div className="space-y-1.5">
        <h1 className="text-h2 font-semibold text-ink">{LOGIN_COPY.title}</h1>
        <p className="text-body text-muted-foreground">{LOGIN_COPY.subtitle}</p>
      </div>

      <form className="mt-7 space-y-5" onSubmit={onSubmit} noValidate>
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
            {...register("email")}
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
            autoComplete="current-password"
            placeholder="••••••••"
            aria-invalid={Boolean(errors.password)}
            className="h-11"
            {...register("password")}
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
              Signing in
            </>
          ) : (
            "Sign in"
          )}
        </Button>

        <div className="flex items-center gap-3 py-0.5">
          <Separator className="flex-1" />
          <span className="text-caption text-muted-foreground">or</span>
          <Separator className="flex-1" />
        </div>

        <GoogleButton />

        <p className="pt-1 text-center text-body text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href={REGISTER_ROUTE}
            className="font-medium text-primary transition-colors hover:text-primary/80"
          >
            Sign up
          </Link>
        </p>
      </form>
    </>
  );
}
