import { PageContainer } from "@/components/layout/pageContainer";
import { SectionContiner } from "@/components/layout/sectionContiner";
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
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  type CreateUserInput,
  createUserSchema,
} from "@/shared/validators/createUserSchema";
import { roles } from "@/shared/constants/role";
import { classNames } from "@/shared/constants/className";
import { api } from "@/utils/api";
import { toast } from "@/hooks/use-toast";

const inputFields = [
  {
    name: "nisn",
    label: "NISN / Kode Guru",
    placeholder: "123456",
  },
  {
    name: "name",
    label: "Nama Lengkap",
    placeholder: "Nama lengkap",
  },
  {
    name: "passwordHash",
    label: "Password",
    placeholder: "••••••",
    type: "password",
  },
] satisfies {
  name: keyof CreateUserInput;
  label: string;
  placeholder: string;
  type?: string;
}[];

export default function CreateAccountPage() {
  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      nisn: "",
      name: "",
      passwordHash: "",
      role: roles[0],
      classesAsStudent: undefined,
      homeRoomFor: [],
    },
  });

  const { mutate, isPending } = api.admin.CreateUser.useMutation({
    onSuccess: () => {
      toast({
        title: "Berhasil",
        description: "membuat Akun",
      });
    },
    onError: (error) => {
      console.log(error);
      toast({
        title: "Gagal",
        description: error.message ?? "Gagal membuat akun",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: CreateUserInput) => {
    const payload = {
      name: values.name,
      nisn: values.nisn,
      passwordHash: values.passwordHash,
      role: values.role,
      classesAsStudent:
        values.role === "STUDENT" ? values.classesAsStudent : undefined,
      homeRoomFor:
        values.role === "TEACHER" && values.homeRoomFor?.length
          ? values.homeRoomFor
          : undefined,
    };

    form.reset();
    mutate(payload);
  };

  const selectedRole = form.watch("role");

  return (
    <PageContainer center variantBg="secondary">
      <SectionContiner>
        <Card className="mx-auto w-full max-w-4xl p-4">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">Buat Akun</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {inputFields.map(
                    ({ name, label, placeholder, type = "text" }) => (
                      <FormField
                        key={name}
                        control={form.control}
                        name={name}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{label}</FormLabel>
                            <FormControl>
                              <Input
                                type={type}
                                placeholder={placeholder}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ),
                  )}

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem key={role} value={role}>
                                {role}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {selectedRole === "STUDENT" && (
                    <FormField
                      control={form.control}
                      name="classesAsStudent"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Kelas</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value ?? undefined}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih kelas" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {classNames.map((kelas) => (
                                <SelectItem key={kelas} value={kelas}>
                                  {kelas.replace("_", " ")}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {selectedRole === "TEACHER" && (
                    <FormField
                      control={form.control}
                      name="homeRoomFor"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
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
                  )}
                </div>

                <CardFooter className="pt-4">
                  <Button type="submit" disabled={isPending} className="w-full">
                    {isPending ? "Loading..." : "Buat Akun"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </SectionContiner>
    </PageContainer>
  );
}
