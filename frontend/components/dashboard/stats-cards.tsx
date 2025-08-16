"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle, Clock, XCircle } from "lucide-react";
import { getUserAppointments } from "@/lib/actions";
import { Appointment } from "@/lib/types";

export function StatsCards() {
  const { data, isLoading } = useQuery({
    queryKey: ["appointments"],
    queryFn: getUserAppointments,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const appointments = (data?.data as Appointment[]) || [];
  const stats = {
    total: appointments.length,
    completed: appointments.filter((apt) => apt.status === "CONFIRMED").length,
    pending: appointments.filter((apt) => apt.status === "PENDING").length,
    cancelled: appointments.filter((apt) => apt.status === "CANCELLED").length,
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Appointments",
      value: stats?.total || 0,
      icon: Calendar,
      description: "All appointments",
    },
    {
      title: "Completed",
      value: stats?.completed || 0,
      icon: CheckCircle,
      description: "Successfully completed",
    },
    {
      title: "Pending",
      value: stats?.pending || 0,
      icon: Clock,
      description: "Awaiting confirmation",
    },
    {
      title: "Cancelled",
      value: stats?.cancelled || 0,
      icon: XCircle,
      description: "Cancelled appointments",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
