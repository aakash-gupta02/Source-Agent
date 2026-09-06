import { UserRole } from "@repo/db/enums";
import type { User } from "@repo/db/models";

export interface AuthUserDto extends Pick<User, "id" | "email" | "role"> {}

export interface AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  user: AuthUserDto;
}
export const REGISTERABLE_ROLES = [UserRole.USER] as const;

export type RegisterableRole = (typeof REGISTERABLE_ROLES)[number];
