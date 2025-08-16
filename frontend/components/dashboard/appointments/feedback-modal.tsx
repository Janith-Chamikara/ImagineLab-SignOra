"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { submitFeedback } from "@/lib/actions";
import { feedbackSchema } from "@/lib/schema";
import { FeedbackFormData, Status } from "@/lib/types";
import { useSession } from "next-auth/react";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

interface FeedbackModalProps {
  appointmentId: string;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<Status | undefined, Error>>;
}

export function FeedbackModal({ appointmentId, refetch }: FeedbackModalProps) {
  const [open, setOpen] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  const { data: session } = useSession();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      appointmentId,
      rating: 0,
      comment: "",
      isAnonymous: false,
    },
  });

  const watchedRating = watch("rating");
  const watchedComment = watch("comment");

  const onSubmit = async (data: FeedbackFormData) => {
    const response = await submitFeedback({
      ...data,
      userId: session?.user.id,
    });

    if (response) {
      if (response.status === "success") {
        toast.success("Feedback submitted successfully!");
        refetch();
        reset();
        setOpen(false);
      } else {
        toast.error(response.message || "Failed to submit feedback.");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Leave Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Experience</DialogTitle>
          <DialogDescription>
            Help us improve our services by sharing your feedback about this
            appointment.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          {/* Rating Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Rating *</label>
            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="p-1 hover:scale-110 transition-transform"
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => field.onChange(star)}
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= (hoveredRating || field.value)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              )}
            />
            {errors.rating && (
              <p className="text-sm text-red-600">{errors.rating.message}</p>
            )}
            {watchedRating > 0 && (
              <p className="text-sm text-gray-600">
                {watchedRating === 1 && "Poor"}
                {watchedRating === 2 && "Fair"}
                {watchedRating === 3 && "Good"}
                {watchedRating === 4 && "Very Good"}
                {watchedRating === 5 && "Excellent"}
              </p>
            )}
          </div>

          {/* Comment Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Comments (Optional)</label>
            <Controller
              name="comment"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Share your thoughts about the service, staff, or overall experience..."
                  rows={4}
                  maxLength={500}
                />
              )}
            />
            <p className="text-xs text-gray-500 text-right">
              {watchedComment?.length || 0}/500 characters
            </p>
          </div>

          {/* Anonymous Checkbox */}
          <div className="flex items-center space-x-2">
            <Controller
              name="isAnonymous"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="anonymous"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <label
              htmlFor="anonymous"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Submit anonymously
            </label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || watchedRating === 0}
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
