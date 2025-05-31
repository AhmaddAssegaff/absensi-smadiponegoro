import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { useQueryParams } from "@/hooks/useQueryParams";
import { buildOrderedQuery } from "@/helper/queryPaginationHelpers";
import type { User, PaginationMeta } from "@/shared/types/user";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

const columns = [
  { key: "name", label: "Nama", sortable: true },
  { key: "nisn", label: "NISN / Kode Guru", sortable: true },
  { key: "role", label: "Role", sortable: true },
];

export const DataTable = ({
  users,
  Pagination,
  isLoading,
}: {
  users: User[];
  Pagination: PaginationMeta;
  isLoading: boolean;
}) => {
  const router = useRouter();
  const { currentPage, currentSortBy, currentOrder, rawParams } =
    useQueryParams();
  const { page, total, totalPages } = Pagination;
  const query = buildOrderedQuery(rawParams);

  const handlePageChange = (newPage: number) => {
    void router.replace(
      `?${new URLSearchParams({ ...query, page: String(newPage) }).toString()}`,
    );
  };

  const handleSort = (sortBy: string) => {
    const newOrder =
      currentSortBy === sortBy && currentOrder === "asc" ? "desc" : "asc";
    void router.replace(
      `?${new URLSearchParams({ ...query, sortBy, order: newOrder }).toString()}`,
    );
  };

  useEffect(() => {
    if (!router.isReady) return;

    const { page, sortBy, order, limit } = router.query;

    const fixedQuery = {
      page: page ?? "1",
      limit: limit ?? "10",
      sortBy: sortBy ?? "createdAt",
      order: order ?? "desc",
    };

    const queryChanged =
      page !== fixedQuery.page ||
      limit !== fixedQuery.limit ||
      sortBy !== fixedQuery.sortBy ||
      order !== fixedQuery.order;

    if (queryChanged) {
      void router.replace(
        {
          pathname: router.pathname,
          query: fixedQuery,
        },
        undefined,
        { shallow: true },
      );
    }
  }, [router, router.isReady, router.query]);

  return (
    <div className="sectionContainerBG rounded-lg border p-6 font-semibold text-black shadow-lg">
      <Table className="min-w-full">
        <TableCaption className="py-2 text-center text-black">
          Click Nama untuk melihat lebih detail
        </TableCaption>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={col.key}
                onClick={col.sortable ? () => handleSort(col.key) : undefined}
                className="select-none px-4 py-3 text-left font-semibold text-black"
              >
                <div className="flex items-center gap-1">
                  {col.label}
                  {currentSortBy === col.key && (
                    <span
                      aria-label={
                        currentOrder === "asc" ? "Ascending" : "Descending"
                      }
                    >
                      {currentOrder === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            [...Array(10)].map((_, i) => (
              <TableRow key={i}>
                {columns.map((col) => (
                  <TableCell key={col.key} className="px-4 py-3">
                    <Skeleton className="bg h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="py-6 text-center italic"
              >
                Tidak ada data untuk ditampilkan
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow
                key={user.id}
                className="transition-colors duration-150"
              >
                <TableCell className="whitespace-nowrap px-4 py-3">
                  <Link
                    href={`/dashboard/admin/user/${user.id}`}
                    className="hover:underline"
                  >
                    {user.name ?? "-"}
                  </Link>
                </TableCell>
                <TableCell className="px-4 py-3">{user.nisn ?? "-"}</TableCell>
                <TableCell className="px-4 py-3 capitalize">
                  {user.role ?? "-"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <Button
            variant={currentPage > 1 ? "secondary" : "outline"}
            disabled={currentPage <= 1}
            onClick={() => handlePageChange(currentPage - 1)}
            aria-label="Halaman sebelumnya"
          >
            ← Previous
          </Button>

          <Button
            variant={currentPage < totalPages ? "secondary" : "outline"}
            disabled={currentPage >= totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            aria-label="Halaman berikutnya"
          >
            Next →
          </Button>
        </div>

        <div className="flex select-none flex-wrap gap-6 text-sm">
          <p>
            Halaman: <span className="font-semibold">{page}</span>
          </p>
          <p>
            Total data: <span className="font-semibold">{total}</span>
          </p>
          <p>
            Total halaman: <span className="font-semibold">{totalPages}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
