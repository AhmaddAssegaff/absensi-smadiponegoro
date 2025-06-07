import { PageContainer } from "@/components/layout/pageContainer";
import { SectionContiner } from "@/components/layout/sectionContiner";
import { QRCodeCanvas } from "qrcode.react";
import { api } from "@/utils/api";
import { dateFormater } from "@/helper/dateFormatter";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // ⬅️ import skeleton

export default function QRCodePage() {
  const { data, isLoading, error } = api.teacher.GetQRCode.useQuery();

  return (
    <PageContainer center variantBg={"secondary"}>
      <SectionContiner>
        <Card className="mx-auto w-full max-w-md shadow-lg">
          <CardContent className="flex flex-col items-center justify-center space-y-4 p-12 text-center">
            {isLoading ? (
              <Skeleton className="h-[256px] w-[256px] rounded-lg" />
            ) : (
              <QRCodeCanvas
                className="w-full max-w-xs"
                value={`${data?.code ?? ""}`}
                size={256}
              />
            )}

            <div className="space-y-1">
              <h1 className="text-lg font-semibold text-gray-800">
                Berlaku Hingga:
              </h1>
              <h1 className="text-sm text-gray-600">
                {isLoading ? (
                  <Skeleton className="h-4 w-48" />
                ) : data?.expiresAt ? (
                  dateFormater(data.expiresAt)
                ) : (
                  "-"
                )}
              </h1>
            </div>

            <div className="space-y-1">
              <h1 className="text-lg font-semibold text-gray-800">
                Di Generate:
              </h1>
              <h1 className="text-sm text-gray-600">
                {isLoading ? (
                  <Skeleton className="h-4 w-48" />
                ) : data?.updatedAt ? (
                  dateFormater(data.updatedAt)
                ) : (
                  "-"
                )}
              </h1>
            </div>
          </CardContent>
        </Card>
      </SectionContiner>
    </PageContainer>
  );
}
