"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  Hash,
} from "lucide-react";
import { departmentSchema } from "@/lib/schema";
import { DepartmentFormData } from "@/lib/types";
import { createDepartment } from "@/lib/actions";
import { toast } from "sonner";

interface DepartmentCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DepartmentCreationModal({
  isOpen,
  onClose,
}: DepartmentCreationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      address: "",
      phoneNumber: "",
      email: "",
      workingHours: {
        monday: { isOpen: true, openTime: "08:00", closeTime: "16:30" },
        tuesday: { isOpen: true, openTime: "08:00", closeTime: "16:30" },
        wednesday: { isOpen: true, openTime: "08:00", closeTime: "16:30" },
        thursday: { isOpen: true, openTime: "08:00", closeTime: "16:30" },
        friday: { isOpen: true, openTime: "08:00", closeTime: "16:30" },
        saturday: { isOpen: false, openTime: "08:00", closeTime: "16:30" },
        sunday: { isOpen: false, openTime: "08:00", closeTime: "16:30" },
      },
      isActive: true,
    },
  });

  const onSubmit = async (data: DepartmentFormData) => {
    console.log("Submitting department data:", data);
    const response = await createDepartment({
      ...data,
      workingHours: JSON.stringify(data.workingHours),
    });
    if (response) {
      if (response.status === "success") {
        toast.success(response.message);
        reset();
        onClose();
      } else {
        toast.error(response.message);
      }
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const days = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
  ] as const;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="!max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Create New Department
          </DialogTitle>
          <DialogDescription>
            Add a new government department to the system with all necessary
            details and contact information.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Department Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Department Name *</Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="name"
                    placeholder="e.g., Department of Motor Traffic"
                    className={errors.name ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Department Code */}
            <div className="space-y-2">
              <Label htmlFor="code" className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Department Code *
              </Label>
              <Controller
                name="code"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="code"
                    placeholder="e.g., DMT"
                    className={errors.code ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.code && (
                <p className="text-sm text-red-600">{errors.code.message}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="description"
                  placeholder="Brief description of the department's services and responsibilities..."
                  rows={3}
                  className={errors.description ? "border-red-500" : ""}
                />
              )}
            />
            {errors.description && (
              <p className="text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact Email
              </Label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="department@gov.lk"
                    className={errors.email ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Contact Phone
              </Label>
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="phoneNumber"
                    placeholder="+94 11 234 5678"
                    className={errors.phoneNumber ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.phoneNumber && (
                <p className="text-sm text-red-600">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Address
            </Label>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="address"
                  placeholder="Complete address including street, city, and postal code..."
                  rows={2}
                  className={errors.address ? "border-red-500" : ""}
                />
              )}
            />
            {errors.address && (
              <p className="text-sm text-red-600">{errors.address.message}</p>
            )}
          </div>

          {/* Working Hours */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Working Hours
            </Label>
            <div className="flex flex-col !w-full justify-between gap-3 p-4 border rounded-lg">
              {days.map(({ key, label }) => (
                <div key={key} className="flex items-center gap-16">
                  <div className="w-20">
                    <Controller
                      name={`workingHours.${key}.isOpen`}
                      control={control}
                      render={({ field }) => (
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <span className="text-sm font-medium">{label}</span>
                        </div>
                      )}
                    />
                  </div>

                  {watch(`workingHours.${key}.isOpen`) && (
                    <div className="flex items-center gap-2 ">
                      <Controller
                        name={`workingHours.${key}.openTime`}
                        control={control}
                        render={({ field }) => (
                          <Input {...field} type="time" className="w-32" />
                        )}
                      />
                      <span className="text-sm text-gray-500">to</span>
                      <Controller
                        name={`workingHours.${key}.closeTime`}
                        control={control}
                        render={({ field }) => (
                          <Input {...field} type="time" className="w-32" />
                        )}
                      />
                    </div>
                  )}

                  {!watch(`workingHours.${key}.isOpen`) && (
                    <span className="text-sm text-gray-500 flex-1">Closed</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Department Status */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Department Status
            </Label>
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <span className="text-sm">
                    {field.value ? "Active" : "Inactive"}
                  </span>
                </div>
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
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Creating Department..." : "Create Department"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
