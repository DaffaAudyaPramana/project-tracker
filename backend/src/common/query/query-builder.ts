export type PaginationQuery = { page: number; limit: number };
export type SortOrder = "asc" | "desc";

export function buildPagination({ page, limit }: PaginationQuery) {
  return {
    skip: (page - 1) * limit,
    take: limit,
  };
}

export function buildMeta({ page, limit }: PaginationQuery, total: number) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

export function buildSorting<T extends string>(sort: T, order: SortOrder): Record<T, SortOrder> {
  return { [sort]: order } as Record<T, SortOrder>;
}

export function buildSearch(search: string | undefined, fields: string[]) {
  if (!search) return undefined;
  return {
    OR: fields.map((field) => ({ [field]: { contains: search, mode: "insensitive" } })),
  };
}
