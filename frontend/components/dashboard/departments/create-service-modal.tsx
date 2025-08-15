"use client";

import type React from "react";

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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { SpinnerLoader } from "@/components/loader";
import { CreateServiceFormData, Department, Status } from "@/lib/types";
import { createServiceSchema } from "@/lib/schema";
import {
  QueryObserverResult,
  RefetchOptions,
  useQuery,
} from "@tanstack/react-query";
import { createService, getAllDepartments } from "@/lib/actions";
import { toast } from "sonner";

type Props = {
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<Status | undefined, Error>>;
};

export function CreateServiceModal({ refetch }: Props) {
  const [open, setOpen] = useState(false);

  const [documentInput, setDocumentInput] = useState("");

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

  const form = useForm<CreateServiceFormData>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      departmentId: "",
      estimatedTime: 30,
      requiredDocuments: [],
      fee: 0,
      isActive: true,
    },
  });

  const handleSubmit = async (data: CreateServiceFormData) => {
    const response = await createService(data);
    if (response) {
      if (response.status === "success") {
        refetch();
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    }

    form.reset();
    setOpen(false);
  };

  const addDocument = () => {
    if (documentInput.trim()) {
      const currentDocs = form.getValues("requiredDocuments") || [];
      if (!currentDocs.includes(documentInput.trim())) {
        form.setValue("requiredDocuments", [
          ...currentDocs,
          documentInput.trim(),
        ]);
        setDocumentInput("");
      }
    }
  };

  const removeDocument = (docToRemove: string) => {
    const currentDocs = form.getValues("requiredDocuments") || [];
    form.setValue(
      "requiredDocuments",
      currentDocs.filter((doc) => doc !== docToRemove)
    );
  };

  const requiredDocuments = form.watch("requiredDocuments") || [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Service</Button>
      </DialogTrigger>
      <DialogContent className="!max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Service</DialogTitle>
          <DialogDescription>
            Add a new service to your department. Fill in all the required
            information.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Birth Certificate" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Code</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., BC001" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what this service provides..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="departmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estimatedTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Time (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="1440"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="fee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Fee</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) =>
                        field.onChange(Number.parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormDescription>Enter 0 for free services</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <FormLabel>Required Documents</FormLabel>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Valid ID, Birth Certificate"
                  value={documentInput}
                  onChange={(e) => setDocumentInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addDocument())
                  }
                />
                <Button type="button" onClick={addDocument} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {requiredDocuments.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {requiredDocuments.map((doc, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {doc}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeDocument(doc)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Service</FormLabel>
                    <FormDescription>
                      Enable this service for public booking
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
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
                    Creating...
                  </>
                ) : (
                  "Create Service"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
