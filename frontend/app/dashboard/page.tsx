import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { RecentDocuments } from "@/components/dashboard/recent-documents";

export default function DashboardPage() {
  return (
    <main className="flex-1 container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>
        <DashboardNav />
      </div>

      <div className="space-y-6">
        <StatsCards />

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <OverviewChart />
          </div>
          <div className="lg:col-span-1">
            <RecentDocuments />
          </div>
        </div>
      </div>
    </main>
  );
}
