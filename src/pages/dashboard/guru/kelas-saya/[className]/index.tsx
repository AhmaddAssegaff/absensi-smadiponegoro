import { PageContainer } from "@/components/layout/pageContainer";
import { SectionContiner } from "@/components/layout/sectionContiner";
import { useRouter } from "next/router";
import type { ClassName } from "@/shared/constants/className";
import { formatClassNameLabel, urlToEnumValue } from "@/helper/enumFormatter";
import { api } from "@/utils/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  type AttendanceFormValues,
  updateManyAttendanceStudentSchema,
} from "@/shared/validators/teacher/updateManyAttandanceStudentShema";
import { toast } from "@/hooks/use-toast";
import { TrashIcon } from "lucide-react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function MyClassDetailTeacherPage() {
  const router = useRouter();
  const className = urlToEnumValue(router.query.className as ClassName);
  const form = useForm<AttendanceFormValues>({
    resolver: zodResolver(updateManyAttendanceStudentSchema),
    defaultValues: {
      attendances: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "attendances",
  });

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
      form.reset();
      toast({ title: "Berhasil", description: "Absensi berhasil di update." });
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

  const handleEdit = (
    studentId: string,
    currentStatus?: AttendanceStatus,
    currentDescription?: string,
  ) => {
    const index = form
      .getValues("attendances")
      .findIndex((a) => a.studentId === studentId);
    if (index === -1) {
      append({
        studentId,
        status: currentStatus ?? "ALPA",
        description: currentDescription ?? "",
      });
    }
  };

  const handleCancel = (studentId: string) => {
    const index = form
      .getValues("attendances")
      .findIndex((a) => a.studentId === studentId);
    if (index !== -1) {
      remove(index);
    }
  };

  const handleSaveAll = () => {
    void form.handleSubmit((data) => {
      updateMutation.mutate(data);
    })();
  };

  const handleDelete = (studentId: string) => {
    deleteMutation.mutate({ studentId });
  };

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
              <h2 className="text-lg font-semibold">Daftar Siswa</h2>
              <div className="w-full overflow-x-auto">
                <Table className="min-w-[1000px]">
                  <TableCaption>
                    Daftar absensi siswa pada hari ini
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Kelas</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Deskripsi</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          {Array.from({ length: 6 }).map((_, j) => (
                            <TableCell key={j}>
                              <Skeleton className="h-4 w-40" />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : detailClass?.students.length ? (
                      detailClass.students.map((student) => {
                        const index = fields.findIndex(
                          (a) => a.studentId === student.id,
                        );
                        const attendance = student.attendances[0];
                        const editing = index !== -1;

                        return (
                          <TableRow key={student.id}>
                            <TableCell>{student.name}</TableCell>
                            <TableCell>
                              {student.classesAsStudent?.ClassName}
                            </TableCell>
                            <TableCell>
                              {attendance?.dateAttandance
                                ? dateFormater(attendance.dateAttandance)
                                : "-"}
                            </TableCell>
                            {editing ? (
                              <>
                                <TableCell>
                                  <Controller
                                    control={form.control}
                                    name={`attendances.${index}.status`}
                                    render={({ field }) => (
                                      <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Pilih status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {Object.values(AttendanceStatus).map(
                                            (s) => (
                                              <SelectItem key={s} value={s}>
                                                {enumToLabel(s)}
                                              </SelectItem>
                                            ),
                                          )}
                                        </SelectContent>
                                      </Select>
                                    )}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Controller
                                    control={form.control}
                                    name={`attendances.${index}.description`}
                                    render={({ field }) => <Input {...field} />}
                                  />
                                </TableCell>
                                <TableCell>
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
                                      attendance?.status === "ALPA"
                                        ? "destructive"
                                        : "secondary"
                                    }
                                  >
                                    {enumToLabel(attendance?.status ?? "")}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {attendance?.description ?? "-"}
                                </TableCell>
                                <TableCell className="flex gap-2">
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
                          colSpan={6}
                          className="text-center text-muted-foreground"
                        >
                          Tidak ada data siswa.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {fields.length > 0 && (
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
