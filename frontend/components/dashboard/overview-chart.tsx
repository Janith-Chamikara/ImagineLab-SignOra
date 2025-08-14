"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { TrendingUp } from "lucide-react"

const data = [
  { month: "Jan", documents: 2 },
  { month: "Feb", documents: 5 },
  { month: "Mar", documents: 2 },
  { month: "Apr", documents: 3 },
  { month: "May", documents: 5 },
  { month: "Jun", documents: 3 },
  { month: "Jul", documents: 3 },
  { month: "Aug", documents: 4 },
  { month: "Sep", documents: 3 },
  { month: "Oct", documents: 2 },
  { month: "Nov", documents: 4 },
  { month: "Dec", documents: 3 },
]

export function OverviewChart() {
  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Overview</CardTitle>
        <TrendingUp className="w-5 h-5 text-gray-500" />
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6B7280" }}
                domain={[0, 6]}
                ticks={[0, 2, 4, 6]}
              />
              <Bar dataKey="documents" fill="#000000" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">Documents</p>
        </div>
      </CardContent>
    </Card>
  )
}
