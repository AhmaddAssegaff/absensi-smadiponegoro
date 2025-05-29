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
import { type Role } from "@prisma/client";
import { type ClassName } from "@prisma/client";
import { api } from "@/utils/api";
import Link from "next/link";

type User = {
  id: string;
  role: Role;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  nisn: string;
  passwordHash: string;
  classId: string | null;

  homeroomFor?: {
    id: string;
    name: string;
    homeroomTeacherId: string | null;
  }[];

  class?: {
    id: string;
    name: string;
    homeroom?: {
      id: string;
      name: ClassName;
    }[];
  } | null;
};

type PaginationMeta = {
  page: number;
  total: number;
  totalPages: number;
};
const columns = [
  { key: "name", label: "Nama", sortable: true },
  { key: "nisn", label: "Name Admin / Kode Guru", sortable: true },
  { key: "role", label: "Role", sortable: true },
  { key: "Wali kelas", label: "Wali kelas", sortable: true },
  { key: "createdAt", label: "Tanggal Buat", sortable: true },
  { key: "updatedAt", label: "Terkahir di Ubah", sortable: true },
];

export const DataTable = ({
  users,
  Pagination,
}: {
  users: User[];
  Pagination: PaginationMeta;
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
    <div className="rounded-md border bg-slate-800 p-4 text-white">
      <Table>
        <TableCaption>Daftar user.</TableCaption>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={col.key}
                onClick={col.sortable ? () => handleSort(col.key) : undefined}
                className={col.sortable ? "cursor-pointer" : ""}
              >
                {col.label}
                {currentSortBy === col.key &&
                  (currentOrder === "asc" ? " ↑" : " ↓")}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Link href={`/dashboard/admin/user/${user.id}`}>
                  {user.name ?? "-"}
                </Link>
              </TableCell>
              <TableCell>{user.nisn}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.homeroomFor?.[0]?.name ?? "-"}</TableCell>
              <TableCell>
                {new Date(user.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(user.updatedAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          <Button
            variant={currentPage > 1 ? "default" : "ghost"}
            disabled={currentPage <= 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Prev Page
          </Button>

          <Button
            variant={currentPage < totalPages ? "default" : "ghost"}
            disabled={currentPage >= totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next Page
          </Button>
        </div>

        <div className="flex select-none gap-6 text-sm">
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
