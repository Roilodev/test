export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/components/products/AddToCartButton";
import ProductGallery from "@/components/products/ProductGallery";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });

  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: { category: product.category, id: { not: product.id } },
    take: 3,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-amber-700">Início</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-amber-700">Catálogo</Link>
        <span>/</span>
        <Link href={`/products?category=${encodeURIComponent(product.category)}`}
          className="hover:text-amber-700">{product.category}</Link>
        <span>/</span>
        <span className="text-gray-900 truncate max-w-32">{product.name}</span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Gallery */}
          <div className="h-72 md:h-auto min-h-72">
            <ProductGallery
              images={(() => { try { const a = JSON.parse(product.images); return Array.isArray(a) && a.length > 0 ? a : [product.imageUrl]; } catch { return [product.imageUrl]; } })()}
              videos={(() => { try { const a = JSON.parse(product.videos); return Array.isArray(a) ? a : []; } catch { return []; } })()}
            />
          </div>

          {/* Info */}
          <div className="p-6 md:p-8 flex flex-col">
            <div>
              <span className="inline-block bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-1 rounded-full mb-3">
                {product.category}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-3xl font-bold text-amber-700 mb-4">
                ${product.price.toFixed(2)}
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
            </div>

            <div className="space-y-3">
              {product.stock > 0 ? (
                <p className="text-green-600 text-sm font-medium flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full inline-block" />
                  Em estoque ({product.stock} disponíveis)
                </p>
              ) : (
                <p className="text-red-500 text-sm font-medium">Sem estoque</p>
              )}

              <AddToCartButton product={product} />

              <div className="grid grid-cols-3 gap-2 pt-4 border-t text-center text-xs text-gray-500">
                <div>
                  <p className="text-base mb-0.5">🚚</p>
                  <p>Frete grátis +$500</p>
                </div>
                <div>
                  <p className="text-base mb-0.5">🛡️</p>
                  <p>Garantia 2 anos</p>
                </div>
                <div>
                  <p className="text-base mb-0.5">↩️</p>
                  <p>30 dias devolução</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Produtos relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map((p) => (
              <Link key={p.id} href={`/products/${p.slug}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden group">
                <div className="relative h-40 bg-gray-100">
                  <Image src={p.imageUrl} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
                </div>
                <div className="p-3">
                  <p className="font-medium text-gray-900 text-sm line-clamp-1">{p.name}</p>
                  <p className="text-amber-700 font-bold">${p.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
