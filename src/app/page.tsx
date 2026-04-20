export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/products/ProductCard";

export default async function Home() {
  const featured = await prisma.product.findMany({
    where: { featured: true, stock: { gt: 0 } },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  const categories = await prisma.product.groupBy({
    by: ["category"],
    _count: { category: true }, //comentario
  });

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-amber-900 to-amber-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Muebles que transforman<br />tu hogar
            </h1>
            <p className="text-amber-100 text-lg mb-8">
              Descubre nuestra colección de muebles de alta calidad, diseñados para
              combinar estilo y funcionalidad en cada rincón de tu espacio.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/products"
                className="inline-block bg-white text-amber-800 font-bold px-8 py-3 rounded-lg hover:bg-amber-50 transition-colors text-center"
              >
                Ver catálogo
              </Link>
              <Link
                href="/products"
                className="inline-block border-2 border-white text-white font-bold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors text-center"
              >
                Ofertas del mes
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-amber-800/30 hidden lg:block" />
      </section>

      {/* Benefits */}
      <section className="bg-white py-8 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { icon: "🚚", text: "Envío gratis +$500" },
              { icon: "🛡️", text: "Garantía 2 años" },
              { icon: "↩️", text: "30 días devolución" },
              { icon: "💬", text: "Atención personalizada" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center justify-center gap-2 text-gray-600 text-sm font-medium">
                <span className="text-xl">{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Categorías</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {categories.map(({ category, _count }) => (
              <Link
                key={category}
                href={`/products?category=${encodeURIComponent(category)}`}
                className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-amber-200 group"
              >
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-amber-200 transition-colors">
                  <span className="text-amber-700 font-bold text-lg">
                    {category[0]}
                  </span>
                </div>
                <p className="font-semibold text-gray-800 text-sm">{category}</p>
                <p className="text-gray-400 text-xs mt-0.5">{_count.category} productos</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Productos destacados</h2>
            <Link href="/products" className="text-amber-700 font-medium hover:text-amber-800 text-sm">
              Ver todos →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-amber-50 py-16">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            ¿Necesitas ayuda para elegir?
          </h2>
          <p className="text-gray-600 mb-6">
            Nuestro asistente virtual está disponible para ayudarte a encontrar
            el mueble perfecto para tu hogar.
          </p>
          <p className="text-amber-700 font-medium">
            Haz clic en el ícono de chat en la esquina inferior derecha 💬
          </p>
        </div>
      </section>
    </div>
  );
}
