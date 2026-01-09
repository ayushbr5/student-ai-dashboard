import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar - Stays put */}
      <div className="w-64 flex-none hidden md:block border-r bg-white">
        <Sidebar />
      </div>

      {/* Page Content - Changes based on the URL */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}