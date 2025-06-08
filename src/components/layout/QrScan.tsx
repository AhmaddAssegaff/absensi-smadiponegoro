import { useEffect, useRef } from "react";
import QrScanner from "qr-scanner";

type Props = {
  onDecode: (result: string) => void;
};

export const QrScan = ({ onDecode }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const scanner = new QrScanner(
      videoRef.current,
      (result) => {
        onDecode(result.data);
        scanner.stop(); // stop setelah scan
      },
      {
        returnDetailedScanResult: true,
      },
    );

    void scanner.start();

    return () => {
      scanner.stop();
    };
  }, [onDecode]);

  return <video ref={videoRef} className="w-full max-w-sm rounded-lg" />;
};
