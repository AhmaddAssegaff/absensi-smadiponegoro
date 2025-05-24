import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { PageContainer } from "@/components/layout/pageContainer";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
  const formSchema = z.object({
    nisn: z.string().min(2).max(50),
    password: z.string().min(5).max(20),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nisn: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await signIn("credentials", {
      redirect: true,
      callbackUrl: "/",
      nisn: values.nisn,
      password: values.password,
    });
  };

  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  if (error === "CredentialsSignin") {
    return console.log(error, "NISN atau password salah."); // kasih toast error
  }

  return (
    <PageContainer variantBg={"secondary"}>
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-center">
            Welcome To Sistem Absensi Smadip
          </CardTitle>
          <CardDescription className="text-center">
            Silahkan Login
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="nisn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NISN / Kode guru</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan NISN" {...field} />
                    </FormControl>
                    <FormDescription>
                      NISN / Kode guru kamu untuk login.
                    </FormDescription>
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
                        type="password"
                        placeholder="Masukkan password"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Password akun kamu.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                Submit
              </Button>
              {/* kasih loading state */}
            </CardFooter>
          </form>
        </Form>
      </Card>
    </PageContainer>
  );
}
