import { Card, CardContent } from "@/components/ui/card"
import { FileText, CheckCircle, Clock, XCircle } from "lucide-react"

const stats = [
  {
    title: "Total Documents",
    value: "43",
    change: "+20.1% from last month",
    icon: FileText,
    iconColor: "text-blue-600",
  },
  {
    title: "Completed Documents",
    value: "23",
    change: "+180.1% from last month",
    icon: CheckCircle,
    iconColor: "text-green-600",
  },
  {
    title: "Pending Documents",
    value: "12",
    change: "+19% from last month",
    icon: Clock,
    iconColor: "text-orange-600",
  },
  {
    title: "Rejected Documents",
    value: "2",
    change: "+19% from last month",
    icon: XCircle,
    iconColor: "text-red-600",
  },
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </div>
              <div className={`p-2 rounded-lg bg-gray-50 ${stat.iconColor}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
