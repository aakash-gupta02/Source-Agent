export type Cursor = {
  createdAt: string;
  id: string;
};

export type CursorPaginationMeta = {
  nextCursor: string | null;
  hasNextPage: boolean;
};