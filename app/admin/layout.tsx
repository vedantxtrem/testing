// app/admin/layout.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/Sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // 🔐 Admin protection
  if (!session || session.user.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-100 mt-16">
      {/* Fixed Sidebar */}
      <AdminSidebar />

      {/* Right Side Content */}
      <div className="flex-1 ml-64 mt-7">
        

        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}