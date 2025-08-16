"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  User,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { getUserAppointments } from "@/lib/actions";
import { Appointment, AppointmentStatus } from "@/lib/types";
import { SpinnerLoader } from "@/components/loader";
import Link from "next/link";

const statusConfig = {
  [AppointmentStatus.PENDING]: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
    description: "Awaiting confirmation",
  },
  [AppointmentStatus.CONFIRMED]: {
    label: "Confirmed",
    color: "bg-blue-100 text-blue-800",
    icon: CheckCircle,
    description: "Ready for appointment",
  },
  [AppointmentStatus.IN_PROGRESS]: {
    label: "In Progress",
    color: "bg-purple-100 text-purple-800",
    icon: Loader2,
    description: "Currently being served",
  },
  [AppointmentStatus.COMPLETED]: {
    label: "Completed",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
    description: "Successfully completed",
  },
  [AppointmentStatus.CANCELLED]: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
    description: "Appointment cancelled",
  },
  [AppointmentStatus.NO_SHOW]: {
    label: "No Show",
    color: "bg-gray-100 text-gray-800",
    icon: AlertCircle,
    description: "Client did not attend",
  },
};

export default function AppointmentsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const response = await getUserAppointments();
      return response;
    },
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
  });

  const [selectedStatus, setSelectedStatus] = useState<
    AppointmentStatus | "ALL"
  >("ALL");

  const appointments = (data?.data as Appointment[]) || [];

  const groupedAppointments = appointments.reduce((acc, appointment) => {
    const status = appointment.status;
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(appointment);
    return acc;
  }, {} as Record<AppointmentStatus, Appointment[]>);

  const filteredAppointments =
    selectedStatus === "ALL"
      ? appointments
      : appointments.filter((apt) => apt.status === selectedStatus);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return <SpinnerLoader />;
  }

  return (
    <main className="flex-1 container mx-auto px-4 py-6">
      <div className="flex flex-row justify-between items-start mb-6">
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Appointments Dashboard
          </h1>
          <p className="text-gray-600">
            View and manage all appointments categorized by status
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={selectedStatus === "ALL" ? "default" : "outline"}
          onClick={() => setSelectedStatus("ALL")}
          className="text-sm"
        >
          All ({appointments.length})
        </Button>
        {Object.entries(AppointmentStatus).map(([key, status]) => {
          const count = groupedAppointments[status]?.length || 0;
          const config = statusConfig[status];
          return (
            <Button
              key={key}
              variant={selectedStatus === status ? "default" : "outline"}
              onClick={() => setSelectedStatus(status)}
              className="text-sm"
            >
              {config.label} ({count})
            </Button>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredAppointments?.map((appointment) => {
          const config = statusConfig[appointment.status];
          const IconComponent = config.icon;

          return (
            <Link
              href={`/dashboard/appointments/${appointment.id}`}
              key={appointment.id}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                      {appointment.service.name}
                    </CardTitle>
                    <Badge className={config.color}>
                      <IconComponent className="h-3 w-3 mr-1" />
                      {config.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {formatDate(appointment.appointmentDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {appointment.timeSlot.startTime} -{" "}
                        {appointment.timeSlot.endTime}
                      </span>
                    </div>
                    {appointment.officer && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          Officer: {appointment.officer.name}
                        </span>
                      </div>
                    )}
                    {appointment.notes && (
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600 truncate">
                          {appointment.notes}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {filteredAppointments.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No appointments found
          </h3>
          <p className="text-gray-600">
            {selectedStatus === "ALL"
              ? "No appointments have been created yet."
              : `No appointments with status "${
                  statusConfig[selectedStatus as AppointmentStatus]?.label
                }".`}
          </p>
        </div>
      )}
    </main>
  );
}
