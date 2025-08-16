"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  UserX,
} from "lucide-react";
import { SpinnerLoader } from "@/components/loader";
import { AppointmentStatus, Status, type Appointment } from "@/lib/types";
import { toast } from "sonner";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { updateAppointment } from "@/lib/actions";

const updateStatusSchema = z.object({
  status: z.nativeEnum(AppointmentStatus),
});

type UpdateStatusFormData = z.infer<typeof updateStatusSchema>;

type Props = {
  appointment: Appointment;

  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<Status, Error>>;
};

const statusConfig = {
  [AppointmentStatus.PENDING]: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Clock,
  },
  [AppointmentStatus.CONFIRMED]: {
    label: "Confirmed",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: CheckCircle,
  },
  [AppointmentStatus.IN_PROGRESS]: {
    label: "In Progress",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: AlertCircle,
  },
  [AppointmentStatus.COMPLETED]: {
    label: "Completed",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
  },
  [AppointmentStatus.CANCELLED]: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle,
  },
  [AppointmentStatus.NO_SHOW]: {
    label: "No Show",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: UserX,
  },
};

export function UpdateAppointmentStatusModal({ appointment, refetch }: Props) {
  const [open, setOpen] = useState(false);

  const form = useForm<UpdateStatusFormData>({
    resolver: zodResolver(updateStatusSchema),
    defaultValues: {
      status: appointment.status,
    },
  });

  const handleSubmit = async (data: UpdateStatusFormData) => {
    try {
      const response = await updateAppointment(appointment.id, data.status);

      if (response) {
        if (response.status === "success") {
          toast.success(response.message);
          setOpen(false);
          refetch();
          form.reset();
        } else {
          toast.error(
            response.message || "Failed to update appointment status"
          );
        }
      }
    } catch (error) {
      toast.error("An error occurred while updating the appointment status");
    }
  };

  const currentStatus = statusConfig[appointment.status];
  const CurrentStatusIcon = currentStatus.icon;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Update Status
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Appointment Status</DialogTitle>
          <DialogDescription>
            Change the status of this appointment and add optional notes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4 border-y">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {appointment.service.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Current Status:
            </span>
            <Badge className={`${currentStatus.color} flex items-center gap-1`}>
              <CurrentStatusIcon className="h-3 w-3" />
              {currentStatus.label}
            </Badge>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select new status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(statusConfig).map(([status, config]) => {
                        const StatusIcon = config.icon;
                        return (
                          <SelectItem key={status} value={status}>
                            <div className="flex items-center gap-2">
                              <StatusIcon className="h-4 w-4" />
                              {config.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={form.formState.isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <SpinnerLoader size="sm" className="mr-2" />
                    Updating...
                  </>
                ) : (
                  "Update Status"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
