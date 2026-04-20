import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminSignOutButton from "@/components/admin/AdminSignOutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin navbar */}
      <nav className="bg-amber-900 text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="font-bold text-lg">
            Admin Panel
          </Link>
          <Link href="/admin" className="text-amber-200 hover:text-white text-sm transition-colors">
            Produtos
          </Link>
          <Link href="/admin/visits" className="text-amber-200 hover:text-white text-sm transition-colors">
            Visitas
          </Link>
          <Link href="/" className="text-amber-200 hover:text-white text-sm transition-colors" target="_blank">
            Ver loja ↗
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-amber-200 text-sm">{session.user?.email}</span>
          <AdminSignOutButton />
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}
