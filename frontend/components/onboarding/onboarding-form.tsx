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
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      fullName: "Janith Chamikara",
      birthday: "2000/02/03",
      address: "No 10/1, Galle, Sri Lanka",
      gnDivision: "Hingunugamuwa",
      divisionalSecretariat: "Badulla",
      contactNumber: "+94-760299855",
      email: "janithchamikara13@gmail.com",
    },
  });

  const onSubmit = async (data: OnboardingFormData) => {
    setIsLoading(true);
    try {
      // Handle onboarding completion logic here
      console.log("Onboarding data:", data);
      // Redirect to dashboard after successful onboarding
      router.push("/dashboard");
    } catch (error) {
      console.error("Onboarding error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Controller
          name="fullName"
          control={control}
          render={({ field }) => (
            <Input {...field} id="fullName" className="h-12" />
          )}
        />
        {errors.fullName && (
          <p className="text-sm text-red-600">{errors.fullName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="birthday">Birthday</Label>
        <Controller
          name="birthday"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="birthday"
              placeholder="YYYY/MM/DD"
              className="h-12"
            />
          )}
        />
        {errors.birthday && (
          <p className="text-sm text-red-600">{errors.birthday.message}</p>
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
          name="contactNumber"
          control={control}
          render={({ field }) => (
            <Input {...field} id="contactNumber" className="h-12" />
          )}
        />
        {errors.contactNumber && (
          <p className="text-sm text-red-600">{errors.contactNumber.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input {...field} id="email" type="email" className="h-12" />
          )}
        />
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
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
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Continue"}
        </Button>
      </div>
    </form>
  );
}
