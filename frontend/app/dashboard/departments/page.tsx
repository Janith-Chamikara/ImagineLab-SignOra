"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Clock, Phone, Mail, MapPin, Users } from "lucide-react";
import { ServiceBookingModal } from "@/components/dashboard/departments/service-booking-modal";
import type { Department, Service } from "@/lib/types";
import { DepartmentCreationModal } from "@/components/dashboard/departments/department-creation-modal";
import { useQuery } from "@tanstack/react-query";
import { getAllDepartments } from "@/lib/actions";
import { SpinnerLoader } from "@/components/loader";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function DepartmentsPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [isCreateDepartmentModalOpen, setIsCreateDepartmentModalOpen] =
    useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const response = await getAllDepartments();
      return response;
    },
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
  });

  const departments = (data?.data as Department[]) || [];

  console.log("Departments data:", departments);

  const handleDepartmentCreate = () => {
    setIsCreateDepartmentModalOpen(true);
  };

  const handleDepartmentCreated = () => {
    setIsCreateDepartmentModalOpen(false);
  };

  return (
    <main className="flex-1 container mx-auto px-4 py-6">
      <div className="flex flex-row justify-between items-start mb-6">
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Government Departments
          </h1>
          <p className="text-gray-600">
            Select a department to view available services and book appointments
          </p>
        </div>
        {session?.user.role === "ADMIN" && (
          <Button onClick={handleDepartmentCreate}>Create Department</Button>
        )}
        <DepartmentCreationModal
          isOpen={isCreateDepartmentModalOpen}
          onClose={() => setIsCreateDepartmentModalOpen(false)}
        />
      </div>

      {isLoading && <SpinnerLoader />}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {departments &&
          departments.map((department) => (
            <Card
              key={department.id}
              onClick={() =>
                router.push(`/dashboard/departments/${department.id}`)
              }
              className="hover:shadow-lg transition-shadow cursor-pointer"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{department.name}</CardTitle>
                  <Badge variant="secondary">{department.code}</Badge>
                </div>
                <CardDescription>{department.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {department?.services && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {department.services.length} services available
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {department.phoneNumber}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {department.address}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </main>
  );
}
