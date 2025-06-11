"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminLayout } from "@/components/admin/admin-layout";
import { ElectionManagement } from "@/components/admin/election-management";
import { useAdminData } from "@/hooks/useAdminData";
import { useAuthStore } from "@/store/useStore";
import { useRouter } from "next/navigation";

export default function AdminElectionsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { isAdmin } = useAdminData();

  // Redirect non-authenticated or non-admin users
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login");
      return;
    }

    if (!isAdmin) {
      router.push("/dashboard");
      return;
    }
  }, [isAuthenticated, isAdmin, router]);

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading elections...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8 p-6 md:p-8">
        <div className="flex items-center justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
              <h1 className="text-3xl font-bold tracking-tight">
                Elections Management
              </h1>
            </div>
            <p className="text-muted-foreground">
              Manage and monitor all electoral processes and candidate
              information.
            </p>
          </div>
        </div>

        <ElectionManagement />
      </div>
    </AdminLayout>
  );
}
