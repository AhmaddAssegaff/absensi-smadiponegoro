import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const AuthButton = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  if (!session) {
    return (
      <Button onClick={() => signIn()} className="px-4 py-2 text-base">
        Sign in
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          className="px-4 py-2 text-base"
          onClick={() => setOpen(true)}
        >
          Sign out
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yakin ingin keluar?</DialogTitle>
          <DialogDescription>
            Kamu akan keluar dari akun ini. Lanjutkan?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Batal</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={async () => {
              setOpen(false);
              await signOut();
            }}
          >
            Ya, keluar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
