import type { Cursor } from "../types/pagination.types.js";

export const encodeCursor = (cursor: Cursor): string => {
  return Buffer.from(JSON.stringify(cursor)).toString("base64url");
};

export const decodeCursor = (cursor: string): Cursor => {
  return JSON.parse(
    Buffer.from(cursor, "base64url").toString(),
  ) as Cursor;
};