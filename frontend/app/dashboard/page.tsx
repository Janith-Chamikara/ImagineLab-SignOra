import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { RecentDocuments } from "@/components/dashboard/recent-documents";

export default function DashboardPage() {
  return (
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
  );
}
