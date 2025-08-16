"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, User } from "lucide-react";
import { getUserAppointments } from "@/lib/actions";
import { Appointment } from "@/lib/types";

export function RecentDocuments() {
  const { data, isLoading } = useQuery({
    queryKey: ["appointments"],
    queryFn: getUserAppointments,
    staleTime: 1000 * 60 * 5,
  });

  const appointments = (data?.data as Appointment[]) || [];

  // Get recent appointments with documents or notes
  const recentItems = appointments
    .filter((apt) => apt.notes || apt.documents?.length > 0)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Loading recent documents...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-muted rounded"></div>
                <div className="flex-1 space-y-1">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest appointments and documents</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentItems.length > 0 ? (
            recentItems.map((appointment) => (
              <div key={appointment.id} className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      {appointment.service.name}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {appointment.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 ml-2" />
                    <span>
                      {new Date(
                        appointment.appointmentDate
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  {appointment.notes && (
                    <p className="text-xs text-muted-foreground truncate">
                      {appointment.notes}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No recent activity
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
