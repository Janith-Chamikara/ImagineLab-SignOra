"use client";

import { UpdateAppointmentStatusModal } from "@/components/dashboard/appointments/update-status-modal";
import { SpinnerLoader } from "@/components/loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAppointmentById, getFeedbacksByAppointmentId } from "@/lib/actions";
import { type Appointment, AppointmentStatus, Feedback } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  Clock,
  User,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Building2,
  Phone,
  Mail,
  Download,
  Eye,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { FeedbackModal } from "@/components/dashboard/appointments/feedback-modal";
import { FeedbackDisplay } from "@/components/dashboard/appointments/feedback-display";

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

export default function AppointmentDetailPage() {
  const { data: session } = useSession();
  const { id } = useParams();
  const router = useRouter();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["appointment", id],
    queryFn: async () => {
      const response = await getAppointmentById(id as string);
      return response;
    },
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
  });

  const { data: feedbackData, refetch: refetchFeedback } = useQuery({
    queryKey: ["feedbackData", id],
    queryFn: async () => {
      const response = await getFeedbacksByAppointmentId(appointment.id);

      return response;
    },
  });

  const feedbacks = (feedbackData?.data as Feedback[]) || [];
  console.log("Feedbacks data:", feedbacks);

  const appointment = (data?.data as Appointment) || null;
  const config = appointment ? statusConfig[appointment.status] : null;
  const IconComponent = config?.icon;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const buildCloudinaryUrl = (filePath: string, options = "") => {
    if (filePath.startsWith("https://")) {
      // If it's already a full URL, just add options if needed
      if (options) {
        // Insert options after '/upload/'
        return filePath.replace("/upload/", `/upload/${options}`);
      }
      return filePath;
    }

    // If it's just a public ID, construct the full URL
    const cloudName =
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "your-cloud-name";
    return `https://res.cloudinary.com/${cloudName}/image/upload/${options}${filePath}`;
  };

  const handleViewDocument = (filePath: string) => {
    const viewUrl = buildCloudinaryUrl(filePath);
    window.open(viewUrl, "_blank");
  };

  const handleDownloadDocument = (filePath: string, fileName: string) => {
    const downloadUrl = buildCloudinaryUrl(filePath, "fl_attachment/");

    // Create a temporary link to trigger download
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = fileName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return <SpinnerLoader />;
  }

  if (!appointment) {
    return (
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Appointment not found
          </h3>
          <p className="text-gray-600">
            The appointment you're looking for doesn't exist or has been
            removed.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 container mx-auto px-4 py-6">
      <div className="mb-6">
        <Button
          onClick={() => router.push("/dashboard/appointments")}
          variant="outline"
          className="mb-4"
        >
          ← Back to Appointments
        </Button>
        <div className="flex flex-row justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Appointment Details
            </h1>
            <p className="text-gray-600">
              {appointment.service.name} -{" "}
              {formatDate(appointment.appointmentDate)}
            </p>
          </div>
          <div className="flex flex-col gap-2 items-end">
            {config && (
              <Badge className={`${config.color} text-sm px-3 py-1`}>
                {IconComponent && <IconComponent className="h-4 w-4 mr-2" />}
                {config.label}
              </Badge>
            )}
            {session?.user.role === "OFFICER" && (
              <UpdateAppointmentStatusModal
                refetch={refetch}
                appointment={appointment}
              />
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 mb-8">
        {/* Appointment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Appointment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Date:</span>
                <span className="text-sm">
                  {formatDate(appointment.appointmentDate)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Time:</span>
                <span className="text-sm">
                  {appointment.timeSlot.startTime} {"-"}
                  {appointment.timeSlot.endTime}
                </span>
              </div>
              {appointment.officer && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Assigned Officer:</span>
                  <span className="text-sm">{appointment.officer.name}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Reference:</span>
                <span className="text-sm font-mono">
                  {appointment.id.slice(-8).toUpperCase()}
                </span>
              </div>
            </div>
            {appointment.notes && (
              <div className="pt-4 border-t">
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div>
                    <span className="text-sm font-medium">Notes:</span>
                    <p className="text-sm text-gray-600 mt-1">
                      {appointment.notes}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Service Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Service Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium text-lg mb-2">
                {appointment.service.name}
              </h3>
              <p className="text-gray-600 mb-4">
                {appointment.service.description}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  {appointment.service.estimatedTime} minutes
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  Fee: LKR {appointment.service.fee.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{appointment.service.code}</Badge>
              </div>
            </div>

            {appointment.service.requiredDocuments &&
              appointment.service.requiredDocuments.length > 0 && (
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">
                    Required Documents:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {appointment.service.requiredDocuments.map((doc) => (
                      <Badge key={doc} variant="outline" className="text-xs">
                        {doc.replace(/_/g, " ")}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
          </CardContent>
        </Card>

        {/* Documents Section */}
        {appointment.documents && appointment.documents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Uploaded Documents
              </CardTitle>
              <CardDescription>
                Documents submitted for this appointment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {appointment.documents.map((document, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-blue-500" />
                      <div>
                        <p className="font-medium">
                          {document.fileName || `Document ${index + 1}`}
                        </p>
                        <p className="text-sm text-gray-500">
                          {document.mimeType || "Unknown type"} •{" "}
                          {document.fileSize || "Unknown size"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDocument(document.filePath)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleDownloadDocument(
                            document.filePath,
                            document.fileName || `document-${index + 1}`
                          )
                        }
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* User Information (for officers/admins) */}
        {(session?.user.role === "OFFICER" ||
          session?.user.role === "ADMIN") && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Client Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Name:</span>
                  <span className="text-sm">{appointment.user.firstName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Email:</span>
                  <span className="text-sm">{appointment.user.email}</span>
                </div>
                {appointment.user.phoneNumber && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Phone:</span>
                    <span className="text-sm">
                      {appointment.user.phoneNumber}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {session?.user.role === "USER" && (
          <>
            <FeedbackDisplay feedback={feedbacks} />

            {/* Show feedback button only to the appointment owner */}
            {session?.user.id === appointment.userId && (
              <div className="flex justify-center">
                <FeedbackModal
                  refetch={refetchFeedback}
                  appointmentId={appointment.id}
                />
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
