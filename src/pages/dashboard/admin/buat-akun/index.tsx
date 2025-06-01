import { PageContainer } from "@/components/layout/pageContainer";
import { SectionContiner } from "@/components/layout/sectionContiner";
import {
  Form,
  FormControl,
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
import { type CreateUserInferFE, createUserFE } from "@/shared/validators/user";
import { roles } from "@/shared/constants/role";
import { classNames } from "@/shared/constants/className";

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
  name: keyof CreateUserInferFE;
  label: string;
  placeholder: string;
  type?: string;
}[];

export default function CreateAccountPage() {
  const form = useForm<CreateUserInferFE>({
    resolver: zodResolver(createUserFE),
    defaultValues: {
      nisn: "",
      name: "",
      passwordHash: "",
      role: roles[0],
      className: undefined,
      homeRoomFor: [],
    },
  });

  const onSubmit = (values: CreateUserInferFE) => {
    console.log(values);
    form.reset();
  };

  const selectedRole = form.watch("role");

  return (
    <PageContainer center variantBg="secondary">
      <SectionContiner>
        <div>
          <Card className="w-full p-4">
            <CardHeader>
              <CardTitle>Buat Akun</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
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
                      name="className"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kelas</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value ?? ""}
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

                  <CardFooter>
                    <Button type="submit" className="w-full">
                      Buat Akun
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </SectionContiner>
    </PageContainer>
  );
}
