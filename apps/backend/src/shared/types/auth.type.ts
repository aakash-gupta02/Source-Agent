import { UserRole } from "@repo/db";

export type AuthContext = {
  userId: string;
  email: string;
  role: UserRole;
};