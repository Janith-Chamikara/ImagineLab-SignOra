"use client";

import { CreateServiceModal } from "@/components/dashboard/departments/create-service-modal";
import { ServiceBookingModal } from "@/components/dashboard/departments/service-booking-modal";
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
import { getDepartmentById } from "@/lib/actions";
import { Department, Service } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Building2, Clock, Mail, MapPin, Phone } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function ServicesPage() {
  const { id } = useParams();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["department", id],
    queryFn: async () => {
      const response = await getDepartmentById(id as string);
      return response;
    },
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
  });

  const router = useRouter();
  const department = (data?.data as Department) || null;
  return (
    <main className="flex-1 container mx-auto px-4 py-6">
      {isLoading && <SpinnerLoader />}
      {department && (
        <div>
          <div className="mb-6">
            <Button
              onClick={() => router.push("/departments")}
              variant="outline"
              className="mb-4"
            >
              ← Back to Departments
            </Button>
            <div className="flex flex-row justify-between items-start">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                  {department.name}
                </h1>
                <p className="text-gray-600">{department.description}</p>
              </div>
              <CreateServiceModal refetch={refetch} />
            </div>
          </div>

          <div className="grid gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Department Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{department.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{department.phoneNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{department.email}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {department?.services && department?.services?.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Available Services</h2>
              <div className="grid gap-4">
                {department.services.map((service) => (
                  <Card
                    key={service.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">
                            {service.name}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {service.description}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary">{service.code}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {service.estimatedTime} minutes
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium">
                            Fee: LKR {service.fee.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {service.requiredDocuments &&
                        service.requiredDocuments.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm font-medium mb-2">
                              Required Documents:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {service.requiredDocuments.map((doc) => (
                                <Badge
                                  key={doc}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {doc.replace(/_/g, " ")}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                      <ServiceBookingModal service={service} />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
