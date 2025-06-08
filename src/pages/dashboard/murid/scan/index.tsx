import { PageContainer } from "@/components/layout/pageContainer";
import { SectionContiner } from "@/components/layout/sectionContiner";
import { QrScan } from "@/components/layout/QrScan";
import { api } from "@/utils/api";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function StudentScanPage() {
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [showReasonDialog, setShowReasonDialog] = useState(false);
  const [reason, setReason] = useState("");
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);

  const { mutate, isPending } = api.student.CreateAttendanceStudent.useMutation(
    {
      onSuccess: () => {
        toast({
          title: "Berhasil!",
          description: "Absensi berhasil direkam.",
        });
        setShowReasonDialog(false);
        setReason("");
        setScannedCode(null);
        setLastScannedCode(null);
        setLocation(null);
      },
      onError: (err) => {
        if (err.message === "Anda terlambat. Harap isi alasan keterlambatan.") {
          setShowReasonDialog(true);
        } else {
          toast({
            title: "Gagal",
            description: err.message,
            variant: "destructive",
          });
        }
      },
    },
  );

  const getLocationAndMutate = (code: string, reasonInput?: string) => {
    if (!navigator.geolocation) {
      alert("Geolocation tidak didukung browser Anda");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        setLocation(coords);

        mutate({
          code,
          latitude: coords.latitude,
          longitude: coords.longitude,
          description: reasonInput,
        });
      },
      (err) => {
        alert("Gagal mendapatkan lokasi: " + err.message);
      },
      { enableHighAccuracy: true },
    );
  };

  const handleScanResult = (result: string) => {
    if (!isPending) {
      setLastScannedCode(result);
      setScannedCode(result);
      getLocationAndMutate(result);
    }
  };

  const handleReasonSubmit = () => {
    if (!isPending && lastScannedCode) {
      getLocationAndMutate(lastScannedCode, reason);
    }
  };

  return (
    <PageContainer center variantBg="secondary">
      <SectionContiner>
        <div className="flex flex-col items-center justify-center">
          <h1 className="mb-4 text-xl font-bold">Scan QR untuk Absen</h1>
          <QrScan onDecode={handleScanResult} />
          {isPending && (
            <p className="mt-2 text-sm text-muted-foreground">
              Mengirim absensi...
            </p>
          )}

          <Dialog open={showReasonDialog} onOpenChange={setShowReasonDialog}>
            <DialogContent>
              <DialogHeader>Alasan Keterlambatan</DialogHeader>
              <p className="mb-2 text-sm text-muted-foreground">
                Anda terlambat. Mohon isi alasan kehadiran Anda.
              </p>
              <Input
                placeholder="Contoh: Terjebak macet, bangun kesiangan, dsb"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              <DialogFooter className="mt-4">
                <Button
                  onClick={handleReasonSubmit}
                  disabled={isPending || !reason.trim()}
                >
                  {isPending ? "Mengirim..." : "Kirim Alasan"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </SectionContiner>
    </PageContainer>
  );
}
