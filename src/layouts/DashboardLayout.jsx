import Sidebar from "../shared/components/Sidebar";
import Topbar from "../shared/components/Topbar";

/**
 * DashboardLayout
 * Wraps any dashboard page with the persistent Sidebar and Topbar.
 *
 * Usage:
 *   <DashboardLayout>
 *     <YourPageContent />
 *   </DashboardLayout>
 *
 * Props:
 *   user  — optional { name, role, initials } passed down to Topbar
 */
export default function DashboardLayout({ children, user }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#0f1117" }}>
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar user={user} />

        <main className="flex flex-1 flex-col overflow-hidden bg-[#0f1117]">
          {children}
        </main>
      </div>
    </div>
  );
}
