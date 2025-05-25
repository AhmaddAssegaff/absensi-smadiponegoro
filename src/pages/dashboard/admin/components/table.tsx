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
// import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";

import { type Role } from "@prisma/client";
import { type ClassName } from "@prisma/client";

type User = {
  id: string;
  role: Role;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  nisn: string;
  passwordHash: string;
  isActive: boolean;
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
  const queryParams = useSearchParams();

  const currentPage = Math.max(1, Number(queryParams.get("page") ?? "1"));
  const currentSortBy = queryParams.get("sortBy") ?? "createdAt";
  const currentOrder = queryParams.get("order") ?? "desc";

  const handleChangePage = (newPage: number) => {
    void router.push({
      href: router.asPath,
      query: {
        page: newPage,
      },
    });
  };

  const handleSort = (column: string) => {
    const newOrder =
      currentSortBy === column && currentOrder === "asc" ? "desc" : "asc";

    void router.push({
      pathname: router.pathname,
      query: {
        ...Object.fromEntries(queryParams.entries()),
        sortBy: column,
        order: newOrder,
        page: 1,
      },
    });
  };

  useEffect(() => {
    if (router.isReady) {
      const { page, sortBy, order } = router.query;

      if (!page || !sortBy || !order) {
        void router.replace(
          {
            pathname: router.pathname,
            query: {
              limit: 10,
              page: page ?? 1,
              sortBy: sortBy ?? "createdAt",
              order: order ?? "asc",
            },
          },
          undefined,
          { shallow: true },
        );
      }
    }
  }, [currentPage, router]);

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
              <TableCell>{user.name ?? "-"}</TableCell>
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
          {currentPage > 1 && (
            <Button onClick={() => handleChangePage(currentPage - 1)}>
              Prev Page
            </Button>
          )}
          {currentPage <= 1 && (
            <Button onClick={() => handleChangePage(currentPage + 1)}>
              Next Page
            </Button>
          )}
        </div>

        <div className="flex select-none gap-6 text-sm">
          <p>
            Halaman: <span className="font-semibold">{Pagination.page}</span>
          </p>
          <p>
            Total data:{" "}
            <span className="font-semibold">{Pagination.total}</span>
          </p>
          <p>
            Total halaman:{" "}
            <span className="font-semibold">{Pagination.totalPages}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
