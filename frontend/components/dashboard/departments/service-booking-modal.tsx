"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
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
import { Input } from "@/components/ui/input";
import {
  CalendarIcon,
  Clock,
  CreditCard,
  Upload,
  X,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { bookingSchema } from "@/lib/schema";
import type { BookingFormData, Service, TimeSlot } from "@/lib/types";
import { SpinnerLoader } from "@/components/loader";
import { useQuery } from "@tanstack/react-query";
import { getAvailableTimeSlots, createAppointment } from "@/lib/actions";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

type ServiceBookingModalProps = {
  service: Service;
};

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
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>({});

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
      documentFiles: {},
    },
  });
  const { data: session } = useSession();
  const watchedDocuments = watch("requiredDocuments");

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // Add basic appointment data
      formData.append("userId", session?.user.id as string);
      formData.append("serviceId", data.serviceId);
      formData.append("timeSlotId", data.timeSlotId);
      formData.append(
        "appointmentDate",
        new Date(data.appointmentDate).toISOString()
      );
      formData.append("status", "PENDING");
      formData.append("notes", data.notes || "");
      formData.append(
        "checklistCompleted",
        JSON.stringify(data.requiredDocuments)
      );
      formData.append("documentTypes", JSON.stringify(data.requiredDocuments));

      Object.entries(uploadedFiles).forEach(([docType, file]) => {
        formData.append("documents", file);
      });

      const response = await createAppointment(formData);

      if (response) {
        if (response.status === "success") {
          toast.success("Appointment created successfully!");
        } else {
          toast.error("Failed to create appointment");
        }
      }

      reset();
      setUploadedFiles({});
      setOpen(false);
    } catch (error) {
      console.error("Booking failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (docType: string, file: File | null) => {
    if (file) {
      setUploadedFiles((prev) => ({ ...prev, [docType]: file }));
      setValue("documentFiles", { ...uploadedFiles, [docType]: file });
    } else {
      const newFiles = { ...uploadedFiles };
      delete newFiles[docType];
      setUploadedFiles(newFiles);
      setValue("documentFiles", newFiles);
    }
  };

  const selectedWeekday = selectedDate
    ? format(selectedDate, "EEEE").toLowerCase()
    : undefined;

  const { data, isLoading } = useQuery({
    queryKey: ["timeSlots", service.departmentId, selectedWeekday],
    queryFn: async () => {
      const response = await getAvailableTimeSlots(
        service.departmentId,
        selectedWeekday as string
      );
      return response;
    },
    enabled: !!selectedWeekday,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
  });

  const timeSlots = (data?.data as TimeSlot[]) || [];
  const filteredTimeSlots = timeSlots.filter(
    (slot) => slot.status === "AVAILABLE"
  );

  const handleClose = () => {
    reset();
    setSelectedDate(undefined);
    setUploadedFiles({});
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Book Service</Button>
      </DialogTrigger>
      <DialogContent className="!max-w-4xl max-h-[90vh] overflow-y-auto">
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
            {isLoading && selectedDate && <SpinnerLoader />}
            <Controller
              name="timeSlotId"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        !selectedDate
                          ? "Please select a date first"
                          : isLoading
                          ? "Loading available slots..."
                          : filteredTimeSlots.length === 0
                          ? "No available slots for selected date"
                          : "Select a time slot"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredTimeSlots.map((slot) => (
                      <SelectItem
                        key={slot.id}
                        value={slot.id}
                        disabled={slot.currentBookings >= slot.maxBookings}
                      >
                        {slot.startTime} - {slot.endTime}
                        {slot.currentBookings >= slot.maxBookings && " (Full)"}
                        {slot.currentBookings < slot.maxBookings &&
                          ` (${
                            slot.maxBookings - slot.currentBookings
                          } spots left)`}
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
            {!selectedDate && (
              <p className="text-sm text-gray-500">
                Please select a date to view available time slots
              </p>
            )}
            {selectedDate && !isLoading && filteredTimeSlots.length === 0 && (
              <p className="text-sm text-orange-600">
                No available time slots for {format(selectedDate, "EEEE")}.
                Please select a different date.
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

                            if (!checked && uploadedFiles[doc.value]) {
                              handleFileUpload(doc.value, null);
                            }
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

          {/* Document Upload Section */}
          {watchedDocuments && watchedDocuments.length > 0 && (
            <div className="space-y-4">
              <Label>Upload Documents</Label>
              <p className="text-sm text-gray-600">
                Please upload the selected documents:
              </p>
              <div className="space-y-3">
                {watchedDocuments.map((docType) => {
                  const docLabel =
                    documentTypes.find((d) => d.value === docType)?.label ||
                    docType;
                  const uploadedFile = uploadedFiles[docType];

                  return (
                    <div
                      key={docType}
                      className="border rounded-lg p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">
                          {docLabel}
                        </Label>
                        {uploadedFile && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFileUpload(docType, null)}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      {uploadedFile ? (
                        <div className="flex items-center gap-2 p-2 bg-green-50 rounded border border-green-200">
                          <FileText className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-700 flex-1">
                            {uploadedFile.name}
                          </span>
                          <span className="text-xs text-green-600">
                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <Label
                            htmlFor={`file-${docType}`}
                            className="cursor-pointer"
                          >
                            <span className="text-sm w-full mx-auto text-gray-600">
                              Click to upload or drag and drop
                            </span>
                            <Input
                              id={`file-${docType}`}
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleFileUpload(docType, file);
                                }
                              }}
                            />
                          </Label>
                          <p className="text-xs text-gray-500 mt-1">
                            PDF, JPG, PNG, DOC, DOCX (Max 10MB)
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

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
                  Creating Appointment...
                </>
              ) : (
                "Create Appointment"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
