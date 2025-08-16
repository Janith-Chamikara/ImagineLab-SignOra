"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, User, Calendar } from "lucide-react";
import { Feedback } from "@/lib/types";

interface FeedbackDisplayProps {
  feedback: Feedback[];
}

export function FeedbackDisplay({ feedback }: FeedbackDisplayProps) {
  if (feedback.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No feedback available for this appointment yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderStars = (rating: number, size = "h-4 w-4") => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Feedback ({feedback.length})
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {feedback.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg p-4 space-y-3 hover:bg-gray-50 transition-colors"
          >
            {/* Header with rating and date */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {renderStars(item.rating)}
                <Badge variant="secondary" className="text-xs">
                  {item.rating}/5
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-3 w-3" />
                {formatDate(item.createdAt)}
              </div>
            </div>

            {/* Comment */}
            {item.comment && (
              <p className="text-gray-700 leading-relaxed">{item.comment}</p>
            )}

            {/* Author */}
            <div className="flex items-center gap-2 text-sm text-gray-500 pt-2 border-t">
              <User className="h-3 w-3" />
              {item.isAnonymous ? (
                <span className="italic">Anonymous feedback</span>
              ) : (
                <span>
                  {item.user?.firstName} {item.user?.lastName}
                </span>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
