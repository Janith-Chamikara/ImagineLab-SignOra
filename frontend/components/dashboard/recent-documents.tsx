import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"

const documents = [
  { name: "Contract Agreement", date: "2025/08/01" },
  { name: "Service Agreement", date: "2025/08/02" },
  { name: "Loan Agreement", date: "2025/08/11" },
  { name: "Partnership Agreement", date: "2025/08/31" },
  { name: "Policy Acknowledgement Form", date: "2025/08/21" },
  { name: "Settlement Agreement", date: "2025/08/11" },
  { name: "Intellectual Property Agreement", date: "2025/08/12" },
]

export function RecentDocuments() {
  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Documents</CardTitle>
        <p className="text-sm text-gray-600">You have submitted 32 documents this month.</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.map((doc, index) => (
            <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors">
              <div className="p-2 bg-gray-100 rounded">
                <FileText className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
              </div>
              <div className="text-xs text-gray-500">{doc.date}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
