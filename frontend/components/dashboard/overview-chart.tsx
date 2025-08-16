"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { getUserAppointments } from "@/lib/actions";
import { Appointment } from "@/lib/types";

export function OverviewChart() {
  const { data, isLoading } = useQuery({
    queryKey: ["appointments"],
    queryFn: getUserAppointments,
    staleTime: 1000 * 60 * 5,
  });

  const appointments = (data?.data as Appointment[]) || [];

  // Group appointments by month
  const monthlyData = appointments.reduce((acc, appointment) => {
    const date = new Date(appointment.appointmentDate);
    const monthKey = date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });

    if (!acc[monthKey]) {
      acc[monthKey] = { month: monthKey, appointments: 0 };
    }
    acc[monthKey].appointments += 1;
    return acc;
  }, {} as Record<string, { month: string; appointments: number }>);

  const chartData = Object.values(monthlyData);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Appointments Overview</CardTitle>
          <CardDescription>Loading chart data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointments Overview</CardTitle>
        <CardDescription>Monthly appointment distribution</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            appointments: {
              label: "Appointments",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="appointments" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
