import type {
  Role as PrismaRole,
  ClassName as PrismaClassName,
} from "@prisma/client";

export type User = {
  id: string;
  role: PrismaRole;
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
      name: PrismaClassName;
    }[];
  } | null;
};

export type PaginationMeta = {
  page: number;
  total: number;
  totalPages: number;
};
