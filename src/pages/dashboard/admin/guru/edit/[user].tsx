import { useRouter } from "next/router";
import { type Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { api } from "@/utils/api";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "@/components/layout/pageContainer";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { SectionContiner } from "@/components/layout/sectionContiner";
import {
  type UpdateTeacherInputFE,
  updateTeacherShemaFE,
} from "@/shared/validators/teacher";
import { classNames } from "@/shared/constants/className";

export default function DetailUserTeacher() {
  const router = useRouter();
  const { user: userId } = router.query;

  const {
    data: userData,
    isLoading,
    isError,
    refetch,
  } = api.admin.GetUserById.useQuery({
    id: userId as string,
  });

  const form = useForm<UpdateTeacherInputFE>({
    resolver: zodResolver(
      updateTeacherShemaFE,
    ) as Resolver<UpdateTeacherInputFE>,
  });
  const { mutate, isPending } = api.admin.UpdateUser.useMutation({
    onSuccess: () => {
      toast({
        title: "Berhasil",
        description: "Data wali kelas berhasil diubah.",
      });
      void refetch();
    },
    onError: (error) => {
      toast({
        title: "Gagal",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: UpdateTeacherInputFE) => {
    if (!userId || typeof userId !== "string" || !userData) return;

    mutate({
      id: userId,
      name: values.name ?? userData.name,
      nisn: values.nisn ?? userData.nisn,
      ...(values.password ? { password: values.password } : {}),
      classNames: values.classNames ?? [],
    });
  };

  useEffect(() => {
    if (userData) {
      form.reset({
        name: userData.name ?? "",
        nisn: userData.nisn ?? "",
        password: "",
        classNames: userData.homeRoomFor?.map((c) => c.name) ?? [],
      });
    }
  }, [userData, form]);

  return (
    <PageContainer variantBg="secondary">
      <SectionContiner>
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="mb-6 text-center">
            <h1 className="mb-1 text-3xl font-bold text-foreground">
              Detail Wali Kelas
            </h1>
            <p className="text-muted-foreground">
              Lihat informasi wali kelas secara ringkas.
            </p>
          </div>

          <Card className="rounded-xl border border-border bg-background shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Informasi Pengguna</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-8 text-muted-foreground">
              {isLoading ? (
                <Skeleton className="h-40 w-full" />
              ) : isError || !userData ? (
                <p className="text-sm text-red-500">Gagal memuat data user.</p>
              ) : (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">Nama:</p>
                    <p>{userData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">NISN:</p>
                    <p>{userData.nisn}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Kelas Diampu:
                    </p>
                    <p>
                      {userData.homeRoomFor?.map((k) => k.name).join(", ") ||
                        "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Role:</p>
                    <p>{userData.role}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Dibuat:
                    </p>
                    <p>
                      {new Date(userData.createdAt).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Diubah:
                    </p>
                    <p>
                      {new Date(userData.updatedAt).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-xl border border-border bg-background shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Ubah Informasi Akun</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-6 pb-8 pt-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama</FormLabel>
                        <FormControl>
                          <Input placeholder="Nama lengkap" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nisn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>NISN</FormLabel>
                        <FormControl>
                          <Input placeholder="NISN" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Kosongkan jika tidak diubah"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="classNames"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kelas Wali</FormLabel>
                        <div className="grid grid-cols-2 gap-2 text-left">
                          {classNames.map((className) => (
                            <label
                              key={className}
                              className="flex items-center gap-2"
                            >
                              <input
                                type="checkbox"
                                checked={
                                  field.value?.includes(className) ?? false
                                }
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.checked
                                      ? [...(field.value ?? []), className]
                                      : (field.value ?? []).filter(
                                          (v) => v !== className,
                                        ),
                                  )
                                }
                              />
                              <span>{className}</span>
                            </label>
                          ))}
                        </div>
                        <FormDescription>
                          Pilih satu atau beberapa kelas.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isPending} className="w-full">
                    {isPending ? "Menyimpan..." : "Simpan"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </SectionContiner>
    </PageContainer>
  );
}
