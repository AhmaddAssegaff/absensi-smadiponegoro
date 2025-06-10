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
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { SectionContiner } from "@/components/layout/sectionContiner";
import { Eye, EyeOff } from "lucide-react";

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    if (isLoading) return;

    setIsLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      callbackUrl: "/",
      nisn: values.nisn,
      password: values.password,
    });

    if (res?.ok) {
      toast({
        title: "Berhasil Login",
        description: "Selamat datang kembali!",
      });

      window.location.href = res.url ?? "/";
    } else {
      setIsLoading(false);
      toast({
        title: "Gagal Sign-in",
        description: "NISN atau password salah.",
        variant: "destructive",
      });
    }
  };

  return (
    <PageContainer center variantBg={"secondary"}>
      <SectionContiner>
        <Card>
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
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Masukkan password"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormDescription>Password akun kamu.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Loading..." : "Submit"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </SectionContiner>
    </PageContainer>
  );
}
