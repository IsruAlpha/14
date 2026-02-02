"use client";

import { LabelList, Pie, PieChart } from "recharts";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";


const chartConfig = {
  votes: {
    label: "Votes",
  },
  single: {
    label: "Single",
    color: "var(--chart-1)",
  },
  relationship: {
    label: "In Relationship",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function RoundedPieChart() {
  const stats = useQuery(api.poll.getVoteStats);

  const chartData = stats
    ? [
      { status: "single", votes: stats.single, fill: "var(--color-single)" },
      {
        status: "relationship",
        votes: stats.relationship,
        fill: "var(--color-relationship)",
      },
    ]
    : [];

  const totalVotes = stats ? stats.single + stats.relationship : 0;

  return (
    <Card className="flex flex-col border-none bg-transparent shadow-none">
      <CardHeader className="items-center pb-0">
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          poll results
          {totalVotes > 0 && (
            <Badge
              variant="outline"
              className="text-primary bg-primary/10 border-none ml-2"
            >
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>{totalVotes} Total</span>
            </Badge>
          )}
        </CardTitle>
        <CardDescription>Real-time relationship status so far</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="status" hideLabel />}
            />
            <Pie
              data={chartData}
              innerRadius="40%"
              dataKey="votes"
              nameKey="status"
              radius={10}
              cornerRadius={8}
              paddingAngle={4}
            >
              <LabelList
                dataKey="votes"
                stroke="none"
                fontSize={12}
                fontWeight={600}
                fill="currentColor"
                formatter={(value: number) => value.toString()}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
