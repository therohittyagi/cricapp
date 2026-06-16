import Sidebar from "../shared/components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#0f1117" }}>
      <Sidebar />
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[#0f1117]">
        {children}
      </main>
    </div>
  );
}
