import { UserRole } from "@repo/db/enums";
import { RegisterableRole } from "@repo/shared/types";
import { Building2, User, type LucideIcon } from "lucide-react";

export type RegisterRoleCopy = {
  apiRole: typeof UserRole.INFLUENCER | typeof UserRole.BRAND;
  label: string;
  title: string;
  description: string;
  subtext?: string;
  continueLabel: string;
  icon: LucideIcon;
};

export const REGISTER_ROLE_OPTIONS: Record<RegisterableRole, RegisterRoleCopy> =
  {
    INFLUENCER: {
      apiRole: UserRole.INFLUENCER,
      label: "Creator",
      title: "I'm a creator",
      description: "Get discovered by brands and paid for work you already do.",
      subtext: "→ Next: connect your socials so brands can see real numbers.",
      continueLabel: "Continue as a creator",
      icon: User,
    },
    BRAND: {
      apiRole: UserRole.BRAND,
      label: "Brand",
      title: "I'm a brand",
      description: "Find creators by performance, not follower count.",
      continueLabel: "Continue as a brand",
      icon: Building2,
    },
  };

export const REGISTER_COPY = {
  step1: {
    title: "How will you use Thread?",
    subtitle:
      "This sets up your workspace. You can create a second account later if you need both.",
  },
  step2: {
    title: "Create your account",
    subtitle: "Tell us who you are to get started",
  },
} as const;
