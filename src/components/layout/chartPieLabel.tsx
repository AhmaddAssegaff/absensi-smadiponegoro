import { Pie, PieChart, Legend } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type PieChartData = {
  name: string;
  value: number;
  fill?: string;
};

type ChartPieLabelProps = {
  title?: string;
  description?: string;
  data: PieChartData[];
  footerChartTitle?: string;
  footerChartDescription?: string;
};

export function ChartPieLabel({
  title = "Pie Chart",
  description,
  data,
  footerChartDescription,
  footerChartTitle,
}: ChartPieLabelProps) {
  return (
    <Card className="my-8 flex flex-col">
      <CardHeader className="items-center pb-0 text-center">
        <CardTitle>{title}</CardTitle>
        {description && (
          <CardDescription className="text-sm text-muted-foreground">
            {description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={{}}
          className="mx-auto aspect-square w-full max-w-[400px] [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart width={300} height={300}>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={data.filter((d) => d.value > 0)}
              dataKey="value"
              label={({ name, percent }) =>
                name === "Sisa" ? "" : `${name} ${(percent * 100).toFixed(0)}%`
              }
            />

            <Legend />
          </PieChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {footerChartTitle}
        </div>
        <div className="leading-none text-muted-foreground">
          {footerChartDescription}
        </div>
      </CardFooter>
    </Card>
  );
}
