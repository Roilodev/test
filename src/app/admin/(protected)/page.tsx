export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export default async function AdminDashboard() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  const stats = {
    total: products.length,
    featured: products.filter((p) => p.featured).length,
    outOfStock: products.filter((p) => p.stock === 0).length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Productos</h1>
        <Link
          href="/admin/products/new"
          className="bg-amber-700 hover:bg-amber-800 text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm flex items-center gap-2"
        >
          <span>+</span> Nuevo producto
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total productos", value: stats.total, color: "bg-blue-50 text-blue-700" },
          { label: "Destacados", value: stats.featured, color: "bg-amber-50 text-amber-700" },
          { label: "Sin stock", value: stats.outOfStock, color: "bg-red-50 text-red-700" },
        ].map(({ label, value, color }) => (
          <div key={label} className={`${color} rounded-xl p-4`}>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm font-medium opacity-80">{label}</p>
          </div>
        ))}
      </div>

      {/* Products table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Producto</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Categoría</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Precio</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Stock</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Destacado</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    No hay productos. <Link href="/admin/products/new" className="text-amber-700 font-medium">Crear el primero</Link>
                  </td>
                </tr>
              )}
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                      <p className="text-gray-400 text-xs">{product.slug}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-0.5 rounded-full">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900 text-sm">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-sm font-medium ${product.stock === 0 ? "text-red-500" : "text-green-600"}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {product.featured ? (
                      <span className="text-amber-500">★</span>
                    ) : (
                      <span className="text-gray-300">☆</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        Editar
                      </Link>
                      <DeleteProductButton id={product.id} name={product.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
