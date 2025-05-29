import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ClassName } from "@prisma/client";

const classNames = Object.values(ClassName) as [ClassName, ...ClassName[]];

const formSchema = z.object({
  className: z.enum(classNames, {
    errorMap: () => ({ message: "Pilih kelas terlebih dahulu" }),
  }),
});

type FormSchemaType = z.infer<typeof formSchema>;

export default function DetailUserTeacher() {
  const router = useRouter();
  const { user: userId } = router.query;

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  });

  const { mutate, isPending } = api.admin.changeTeacherHomeRoom.useMutation({
    onSuccess: () => {
      toast({
        title: "Berhasil mengubah",
        description: "Berhasil mengubah wali kelas",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormSchemaType) => {
    if (!userId || typeof userId !== "string") {
      toast({
        title: "Error",
        description: "User ID tidak tersedia",
        variant: "destructive",
      });
      return;
    }

    mutate({ userId, className: data.className });
  };

  const { data, isLoading, isError } = api.admin.getUserById.useQuery({
    id: userId,
  });

  console.log(data);

  return (
    <main className="mx-auto max-w-md rounded bg-white p-4 shadow">
      <h1 className="mb-4 text-2xl font-bold">Ubah Wali Kelas</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="className"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pilih Wali Kelas</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kelas" />
                    </SelectTrigger>
                    <SelectContent>
                      {classNames.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
                <FormDescription>
                  Kamu bisa mengubah wali kelas untuk user ini.
                </FormDescription>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending}>
            {isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        </form>
      </Form>
    </main>
  );
}
