"use client";

import type React from "react";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Clock, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { bookingSchema } from "@/lib/schema";
import type {
  BookingFormData,
  Department,
  Service,
  TimeSlot,
} from "@/lib/types";
import { SpinnerLoader } from "@/components/loader";

type ServiceBookingModalProps = {
  service: Service;
};

const mockTimeSlots: TimeSlot[] = [
  {
    id: "ts1",
    departmentId: "1",
    date: new Date(),
    startTime: new Date("2024-01-15T09:00:00"),
    endTime: new Date("2024-01-15T09:30:00"),
    maxBookings: 1,
    currentBookings: 0,
    status: "AVAILABLE",
  },
  {
    id: "ts2",
    departmentId: "1",
    date: new Date(),
    startTime: new Date("2024-01-15T10:00:00"),
    endTime: new Date("2024-01-15T10:30:00"),
    maxBookings: 1,
    currentBookings: 0,
    status: "AVAILABLE",
  },
  {
    id: "ts3",
    departmentId: "1",
    date: new Date(),
    startTime: new Date("2024-01-15T11:00:00"),
    endTime: new Date("2024-01-15T11:30:00"),
    maxBookings: 1,
    currentBookings: 1,
    status: "FULL",
  },
];

const documentTypes = [
  { value: "NATIONAL_ID", label: "National ID" },
  { value: "BIRTH_CERTIFICATE", label: "Birth Certificate" },
  { value: "MARRIAGE_CERTIFICATE", label: "Marriage Certificate" },
  { value: "PASSPORT", label: "Passport" },
  { value: "UTILITY_BILL", label: "Utility Bill" },
  { value: "BANK_STATEMENT", label: "Bank Statement" },
  { value: "EMPLOYMENT_LETTER", label: "Employment Letter" },
  { value: "MEDICAL_CERTIFICATE", label: "Medical Certificate" },
  { value: "OTHER", label: "Other" },
];

export function ServiceBookingModal({ service }: ServiceBookingModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      serviceId: service?.id || "",
      timeSlotId: "",
      appointmentDate: "",
      notes: "",
      requiredDocuments: [],
    },
  });

  const watchedDocuments = watch("requiredDocuments");

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    try {
      reset();
      setOpen(false);
    } catch (error) {
      console.error("Booking failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setSelectedDate(undefined);
    setOpen(false);
  };

  const availableTimeSlots = mockTimeSlots.filter(
    (slot) => slot.status === "AVAILABLE"
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Book Service</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Service: {service.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Service Information */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm">
                Estimated time: {service.estimatedTime} minutes
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-gray-500" />
              <span className="text-sm">
                Service fee: LKR {service.fee.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label>Appointment Date *</Label>
            <Controller
              name="appointmentDate"
              control={control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        format(selectedDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                      }}
                      disabled={(date) =>
                        date < new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.appointmentDate && (
              <p className="text-sm text-red-600">
                {errors.appointmentDate.message}
              </p>
            )}
          </div>

          {/* Time Slot Selection */}
          <div className="space-y-2">
            <Label>Available Time Slots *</Label>
            <Controller
              name="timeSlotId"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimeSlots.map((slot) => (
                      <SelectItem key={slot.id} value={slot.id}>
                        {format(slot.startTime, "HH:mm")} -{" "}
                        {format(slot.endTime, "HH:mm")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.timeSlotId && (
              <p className="text-sm text-red-600">
                {errors.timeSlotId.message}
              </p>
            )}
          </div>

          {/* Required Documents */}
          <div className="space-y-3">
            <Label>Required Documents *</Label>
            <p className="text-sm text-gray-600">
              Please select the documents you will bring for this service:
            </p>
            <div className="grid grid-cols-2 gap-3">
              {documentTypes
                .filter(
                  (doc) =>
                    service.requiredDocuments?.includes(doc.value) ||
                    doc.value === "OTHER"
                )
                .map((doc) => (
                  <div key={doc.value} className="flex items-center space-x-2">
                    <Controller
                      name="requiredDocuments"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          id={doc.value}
                          checked={field.value?.includes(doc.value)}
                          onCheckedChange={(checked) => {
                            const updatedDocs = checked
                              ? [...(field.value || []), doc.value]
                              : field.value?.filter((d) => d !== doc.value) ||
                                [];
                            field.onChange(updatedDocs);
                          }}
                        />
                      )}
                    />
                    <Label
                      htmlFor={doc.value}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {doc.label}
                    </Label>
                  </div>
                ))}
            </div>
            {errors.requiredDocuments && (
              <p className="text-sm text-red-600">
                {errors.requiredDocuments.message}
              </p>
            )}
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label>Additional Notes (Optional)</Label>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Any additional information or special requirements..."
                  rows={3}
                />
              )}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 bg-transparent"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <>
                  <SpinnerLoader size="sm" className="mr-2" />
                  Booking...
                </>
              ) : (
                "Book Appointment"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
