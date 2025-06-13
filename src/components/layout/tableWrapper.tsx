import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useSetQueryParams } from "@/hooks/useSetQueryParams";
import { useQueryParams } from "@/hooks/useQueryParams";
import React from "react";

export type Column<T> = {
  key: keyof T;
  label: string;
  sortable?: boolean;
};

export type PaginationMeta = {
  page: number;
  total: number;
  totalPages: number;
};

type TableWrapperProps<T> = {
  columns: Column<T>[];
  data: T[];
  isLoading: boolean;
  error?: string;
  pagination: PaginationMeta;
  children: (item: T) => React.ReactNode;
};

export function TableWrapper<T>({
  columns,
  data,
  isLoading,
  error,
  pagination,
  children,
}: TableWrapperProps<T>) {
  const { currentPage, currentSortBy, currentOrder } = useQueryParams();
  const { setQueryParams } = useSetQueryParams();

  const handlePageChange = (newPage: number) => {
    setQueryParams({ page: String(newPage) });
  };

  const handleSort = (sortBy: string) => {
    const newOrder =
      currentSortBy === sortBy && currentOrder === "asc" ? "desc" : "asc";
    setQueryParams({ sortBy, order: newOrder });
  };

  return (
    <div className="rounded-lg border bg-white p-4 text-black shadow-lg">
      <div className="w-full overflow-x-auto">
        <Table className="min-w-[700px]">
          <TableCaption className="py-2 text-center text-black">
            Klik kolom untuk sorting
          </TableCaption>

          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead
                  key={String(col.key)}
                  onClick={
                    col.sortable ? () => handleSort(String(col.key)) : undefined
                  }
                  className="cursor-pointer select-none px-4 py-3 text-left font-semibold text-black"
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {currentSortBy === col.key && (
                      <span>{currentOrder === "asc" ? "▲" : "▼"}</span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {error ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="py-6 text-center text-red-500"
                >
                  {error}
                </TableCell>
              </TableRow>
            ) : isLoading ? (
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              [...Array(10)].map((_, i) => (
                <TableRow key={i}>
                  {columns.map((col) => (
                    <TableCell key={String(col.key)} className="px-4 py-3">
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="py-6 text-center italic"
                >
                  Tidak ada data
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, i) => (
                <TableRow key={i}>{children(item)}</TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex justify-center gap-2">
          <Button
            variant={currentPage > 1 ? "secondary" : "outline"}
            disabled={currentPage <= 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            ← Sebelumnya
          </Button>
          <Button
            variant={
              currentPage < pagination.totalPages ? "secondary" : "outline"
            }
            disabled={currentPage >= pagination.totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Berikutnya →
          </Button>
        </div>

        <div className="flex flex-col items-center gap-1 text-sm sm:flex-row sm:gap-6">
          <p>
            Halaman: <span className="font-semibold">{pagination.page}</span>
          </p>
          <p>
            Total data:{" "}
            <span className="font-semibold">{pagination.total}</span>
          </p>
          <p>
            Total halaman:{" "}
            <span className="font-semibold">{pagination.totalPages}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
