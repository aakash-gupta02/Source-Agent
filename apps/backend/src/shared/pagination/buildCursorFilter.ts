import { decodeCursor } from "../utils/cursor.js";

export const buildCursorFilter = (cursor?: string) => {
  if (!cursor) {
    return {};
  }

  const { createdAt, id } = decodeCursor(cursor);

  return {
    OR: [
      {
        createdAt: {
          lt: new Date(createdAt),
        },
      },
      {
        createdAt: new Date(createdAt),
        id: {
          lt: id,
        },
      },
    ],
  };
};
