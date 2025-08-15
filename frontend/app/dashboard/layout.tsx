import { DashboardNav } from "@/components/dashboard/dashboard-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1 container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>
        <DashboardNav />
      </div>
      {children}
    </main>
  );
}
