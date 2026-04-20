export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/products/ProductCard";
import Link from "next/link";

type SearchParams = { category?: string };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const category = params.category;

  const categories = await prisma.product.groupBy({
    by: ["category"],
    orderBy: { category: "asc" },
  });

  const products = await prisma.product.findMany({
    where: category ? { category } : undefined,
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-amber-700">Início</Link>
        <span>/</span>
        <span className="text-gray-900">Catálogo</span>
        {category && (
          <>
            <span>/</span>
            <span className="text-gray-900">{category}</span>
          </>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar filters */}
        <aside className="md:w-56 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 sticky top-20">
            <h3 className="font-bold text-gray-900 mb-3">Categorias</h3>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/products"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    !category
                      ? "bg-amber-100 text-amber-800 font-semibold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Todos os produtos
                </Link>
              </li>
              {categories.map(({ category: cat }) => (
                <li key={cat}>
                  <Link
                    href={`/products?category=${encodeURIComponent(cat)}`}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      category === cat
                        ? "bg-amber-100 text-amber-800 font-semibold"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Products grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">
              {category || "Todos os produtos"}
            </h1>
            <span className="text-sm text-gray-500">{products.length} produtos</span>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">🛋️</p>
              <p className="font-medium">Nenhum produto nesta categoria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
