import "express-serve-static-core";
import { AuthContext } from "./auth.type.ts";

declare module "express-serve-static-core" {
  interface Request {
    user: AuthContext;

    refreshToken: string;
  }
}
