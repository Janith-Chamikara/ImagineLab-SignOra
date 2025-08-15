"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { onboardingSchema, type OnboardingFormData } from "@/lib/schema";
import { useRouter } from "next/navigation";
import { Popover, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { PopoverContent } from "@radix-ui/react-popover";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { completeOnboarding } from "@/lib/actions";
import { signIn, useSession } from "next-auth/react";
import { toast } from "sonner";

const gnDivisions = [
  "Hingunugamuwa",
  "Colombo",
  "Kandy",
  "Galle",
  "Matara",
  "Jaffna",
  "Batticaloa",
  "Anuradhapura",
  "Polonnaruwa",
  "Kurunegala",
];

const divisionalSecretariats = [
  "Badulla",
  "Colombo",
  "Kandy",
  "Galle",
  "Matara",
  "Jaffna",
  "Batticaloa",
  "Anuradhapura",
  "Polonnaruwa",
  "Kurunegala",
];

export function OnboardingForm() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
  });

  const { data: session, update } = useSession();
  const onSubmit = async (data: OnboardingFormData) => {
    if (!session) {
      toast.error("Cannot find your id");
      return;
    }
    const response = await completeOnboarding(session?.user.id, {
      ...data,
      dateOfBirth: data.dateOfBirth.toISOString(),
    });
    if (response) {
      if (response.status === "success") {
        toast.success(response.message);

        localStorage.setItem("isOnboardingCompleted", "TRUE");
        router.push("/login");
      } else {
        toast.error(response.message);
      }
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="fullName">First Name</Label>
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <Input {...field} id="fullName" className="h-12" />
          )}
        />
        {errors.firstName && (
          <p className="text-sm text-red-600">{errors.firstName.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastName">Last Name</Label>
        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <Input {...field} id="fullName" className="h-12" />
          )}
        />
        {errors.lastName && (
          <p className="text-sm text-red-600">{errors.lastName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="birthday">Birthday</Label>
        <Controller
          name="dateOfBirth"
          control={control}
          render={({ field }) => (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  captionLayout="dropdown"
                />
              </PopoverContent>
            </Popover>
          )}
        />
        {errors.dateOfBirth && (
          <p className="text-sm text-red-600">{errors.dateOfBirth.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <Input {...field} id="address" className="h-12" />
          )}
        />
        {errors.address && (
          <p className="text-sm text-red-600">{errors.address.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gnDivision">GN Division</Label>
          <Controller
            name="gnDivision"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select GN Division" />
                </SelectTrigger>
                <SelectContent>
                  {gnDivisions.map((division) => (
                    <SelectItem key={division} value={division}>
                      {division}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.gnDivision && (
            <p className="text-sm text-red-600">{errors.gnDivision.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="divisionalSecretariat">
            Divisional Secretariat Division
          </Label>
          <Controller
            name="divisionalSecretariat"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select Divisional Secretariat" />
                </SelectTrigger>
                <SelectContent>
                  {divisionalSecretariats.map((secretariat) => (
                    <SelectItem key={secretariat} value={secretariat}>
                      {secretariat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.divisionalSecretariat && (
            <p className="text-sm text-red-600">
              {errors.divisionalSecretariat.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactNumber">Contact number</Label>
        <Controller
          name="phoneNumber"
          control={control}
          render={({ field }) => (
            <Input {...field} id="contactNumber" className="h-12" />
          )}
        />
        {errors.phoneNumber && (
          <p className="text-sm text-red-600">{errors.phoneNumber.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">National Id Number</Label>
        <Controller
          name="nationalId"
          control={control}
          render={({ field }) => (
            <Input {...field} id="email" type="text" className="h-12" />
          )}
        />
        {errors.nationalId && (
          <p className="text-sm text-red-600">{errors.nationalId.message}</p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={handleGoBack}
          className="h-12 flex-1 bg-transparent"
        >
          Go back
        </Button>
        <Button
          type="submit"
          className="h-12 flex-1 bg-black text-white hover:bg-gray-800"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Continue"}
        </Button>
      </div>
    </form>
  );
}
