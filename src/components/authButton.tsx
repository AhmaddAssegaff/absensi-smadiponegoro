import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";

export const AuthButton = () => {
  const { data: session, status } = useSession();

  return (
    <Button
      onClick={async () => {
        await (session ? signOut() : signIn());
      }}
      variant={session ? "destructive" : "default"}
      className="px-4 py-2 text-base"
    >
      {session ? "Sign out" : "Sign in"}
    </Button>
  );
};
