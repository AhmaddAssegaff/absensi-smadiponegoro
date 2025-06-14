import { PageContainer } from "@/components/layout/pageContainer";
import { SectionContiner } from "@/components/layout/sectionContiner";
import { useRouter } from "next/router";
import type { ClassName } from "@/shared/constants/className";
import { formatClassNameLabel, urlToEnumValue } from "@/helper/enumFormatter";
import { api } from "@/utils/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { dateFormater, enumToLabel } from "@/helper";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AttendanceStatus } from "@/shared/constants/attendanceStatus";
import { toast } from "@/hooks/use-toast";
import { TrashIcon } from "lucide-react";

export default function MyClassDetailTeacherPage() {
  const router = useRouter();
  const className = urlToEnumValue(router.query.className as ClassName);
  const [editing, setEditing] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<
    Record<
      string,
      { status: AttendanceStatus; description: string | undefined }
    >
  >({});

  const utils = api.useUtils();

  const {
    data: detailClass,
    isLoading,
    error,
  } = api.teacher.GetMyClassByClassName.useQuery(
    { className: className as ClassName },
    { enabled: !!className },
  );

  const updateMutation = api.teacher.UpdateManyAttandanceStudents.useMutation({
    onSuccess: () => {
      setEditing({});
      setFormData({});
      toast({
        title: "Berhasil",
        description: "Absensi berhasil di update.",
      });
      void utils.teacher.GetMyClassByClassName.invalidate();
    },
    onError: (err) => {
      toast({
        title: "Gagal",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const handleEdit = (
    studentId: string,
    currentStatus?: AttendanceStatus,
    currentDescription?: string,
  ) => {
    setEditing((prev) => ({ ...prev, [studentId]: true }));
    setFormData((prev) => ({
      ...prev,
      [studentId]: {
        status: currentStatus ?? "ALPA",
        description: currentDescription ?? "",
      },
    }));
  };

  const handleChange = (
    studentId: string,
    field: "status" | "description",
    value: string,
  ) => {
    setFormData((prev) => {
      const existing = prev[studentId] ?? {
        status: "ALPA",
        description: "",
      };

      return {
        ...prev,
        [studentId]: {
          ...existing,
          [field]: value,
        },
      };
    });
  };

  const handleCancel = (studentId: string) => {
    setEditing((prev) => {
      const updated = { ...prev };
      delete updated[studentId];
      return updated;
    });

    setFormData((prev) => {
      const updated = { ...prev };
      delete updated[studentId];
      return updated;
    });
  };

  const handleSaveAll = () => {
    const attendances = Object.entries(formData).map(([studentId, data]) => ({
      studentId,
      status: data.status,
      description: data.description,
    }));

    updateMutation.mutate({
      attendances,
    });
  };

  const deleteMutation = api.teacher.DeleteTodayAttendanceStudent.useMutation({
    onSuccess: () => {
      toast({
        title: "Berhasil",
        description: "Absensi berhasil dihapus.",
      });
      void utils.teacher.GetMyClassByClassName.invalidate();
    },
    onError: (err) => {
      toast({
        title: "Gagal",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const handleDelete = (studentId: string) => {
    deleteMutation.mutate({ studentId });
  };

  const hasPendingEdits = Object.keys(formData).length > 0;

  return (
    <PageContainer center variantBg="secondary">
      <SectionContiner>
        <div className="space-y-6">
          {detailClass && (
            <Card className="p-6">
              <CardHeader>
                <div className="space-y-1 text-center">
                  <h1 className="text-2xl font-bold">
                    {formatClassNameLabel(detailClass.ClassName)}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Wali Kelas:{" "}
                    <span className="font-medium text-black">
                      {detailClass.homeroom?.name ?? "-"}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Jumlah Siswa:{" "}
                    <span className="font-medium text-black">
                      {detailClass._count.students}
                    </span>
                  </p>
                </div>
              </CardHeader>
            </Card>
          )}

          <Card className="p-6">
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-semibold">Daftar Siswa</h2>
              </div>

              <div className="w-full overflow-x-auto">
                <Table className="min-w-[600px]">
                  <TableCaption>
                    Daftar absensi siswa pada hari ini
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px]">Nama</TableHead>
                      <TableHead className="min-w-[180px]">
                        Absensi Pada Hari
                      </TableHead>
                      <TableHead className="min-w-[120px]">Status</TableHead>
                      <TableHead className="min-w-[240px]">Deskripsi</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            <Skeleton className="h-4 w-40" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-32" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-24" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-52" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-20" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : error ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center text-red-500"
                        >
                          Terjadi kesalahan:{" "}
                          {error.data?.httpStatus ?? "Unknown"}{" "}
                          {error.data?.code ?? "Unknown"}
                        </TableCell>
                      </TableRow>
                    ) : detailClass?.students.length ? (
                      detailClass.students.map((student) => {
                        const attendance = student.attendances[0];
                        const isEditing = editing[student.id];

                        return (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">
                              {student.name}
                            </TableCell>
                            <TableCell>
                              {attendance?.dateAttandance
                                ? dateFormater(attendance.dateAttandance)
                                : "-"}
                            </TableCell>

                            {isEditing ? (
                              <>
                                <TableCell>
                                  <Select
                                    value={formData[student.id]?.status}
                                    onValueChange={(val) =>
                                      handleChange(
                                        student.id,
                                        "status",
                                        val as AttendanceStatus,
                                      )
                                    }
                                  >
                                    <SelectTrigger className="w-[140px]">
                                      <SelectValue placeholder="Pilih status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {Object.values(AttendanceStatus).map(
                                        (status) => (
                                          <SelectItem
                                            key={status}
                                            value={status}
                                          >
                                            {enumToLabel(status)}
                                          </SelectItem>
                                        ),
                                      )}
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                                <TableCell>
                                  <Input
                                    value={formData[student.id]?.description}
                                    onChange={(e) =>
                                      handleChange(
                                        student.id,
                                        "description",
                                        e.target.value,
                                      )
                                    }
                                  />
                                </TableCell>
                                <TableCell className="space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleCancel(student.id)}
                                  >
                                    Batal
                                  </Button>
                                </TableCell>
                              </>
                            ) : (
                              <>
                                <TableCell>
                                  <Badge
                                    variant={
                                      attendance?.status === "ALPA" ||
                                      attendance?.status === "HADIR_TERLAMBAT"
                                        ? "destructive"
                                        : "secondary"
                                    }
                                  >
                                    {enumToLabel(attendance?.status ?? "") ??
                                      "Belum ada keterangan"}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {attendance?.description ?? "-"}
                                </TableCell>
                                <TableCell className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      handleEdit(
                                        student.id,
                                        attendance?.status,
                                        attendance?.description,
                                      )
                                    }
                                  >
                                    Edit
                                  </Button>
                                  {attendance && (
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      onClick={() => handleDelete(student.id)}
                                    >
                                      <TrashIcon className="h-4 w-4 text-red-500" />
                                    </Button>
                                  )}
                                </TableCell>
                              </>
                            )}
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center text-muted-foreground"
                        >
                          Tidak ada data siswa.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {hasPendingEdits && (
                <div className="flex justify-end">
                  <Button
                    onClick={handleSaveAll}
                    disabled={updateMutation.isPending}
                  >
                    {updateMutation.isPending ? "Menyimpan..." : "Simpan Semua"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </SectionContiner>
    </PageContainer>
  );
}
