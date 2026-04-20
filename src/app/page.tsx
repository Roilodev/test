export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/products/ProductCard";
import VisitButton from "@/components/VisitButton";

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
      <section className="relative min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden">
        {/* Background image */}
        <Image
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&q=80"
          alt="Sala de estar elegante"
          fill
          className="object-cover object-center"
          priority
          unoptimized
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/10" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="max-w-xl">
            <span className="inline-block bg-amber-500/90 text-white text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full mb-5">
              Nova coleção 2026
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-5 drop-shadow-md">
              Móveis que<br />
              <span className="text-amber-400">transformam</span><br />
              seu lar
            </h1>
            <p className="text-white/80 text-lg md:text-xl mb-8 leading-relaxed">
              Design, qualidade e conforto em cada peça. Encontre o estilo
              perfeito para cada canto do seu espaço.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-white font-bold px-8 py-3.5 rounded-xl transition-colors shadow-lg"
              >
                Ver catálogo
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-bold px-8 py-3.5 rounded-xl transition-colors"
              >
                Ofertas do mês
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-10 pt-8 border-t border-white/20">
              {[
                { value: "+500", label: "Produtos" },
                { value: "2 anos", label: "Garantia" },
                { value: "4.9★", label: "Avaliação" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-white font-bold text-xl">{value}</p>
                  <p className="text-white/60 text-sm">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white py-8 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { icon: "🚚", text: "Frete grátis +$500" },
              { icon: "🛡️", text: "Garantia 2 anos" },
              { icon: "↩️", text: "30 dias devolução" },
              { icon: "💬", text: "Atendimento personalizado" },
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Categorias</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {categories.map(({ category, _count }) => {
              const images: Record<string, string> = {
                "Sofás": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=70",
                "Camas": "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=400&q=70",
                "Mesas": "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=400&q=70",
                "Cadeiras": "https://images.unsplash.com/photo-1503602642458-232111445657?w=400&q=70",
                "Armazenamento": "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400&q=70",
                "Escrivaninhas": "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=70",
                "Iluminação": "https://images.unsplash.com/photo-1513506003901-1e6a18f5e38a?w=400&q=70",
              };
              const img = images[category] ?? `https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=70`;
              return (
                <Link
                  key={category}
                  href={`/products?category=${encodeURIComponent(category)}`}
                  className="relative rounded-2xl overflow-hidden aspect-[4/5] group shadow-sm hover:shadow-xl transition-shadow"
                >
                  <Image
                    src={img}
                    alt={category}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="font-bold text-white text-sm leading-tight">{category}</p>
                    <p className="text-white/70 text-xs mt-0.5">{_count.category} produto{_count.category !== 1 ? "s" : ""}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Produtos em destaque</h2>
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

      {/* Personalized Service Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-stone-900 via-amber-950 to-stone-900 py-20">
        {/* Decorative blurs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-700/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* Left — Text */}
            <div>
              <span className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full mb-5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Atendimento Personalizado
              </span>

              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
                O móvel certo,<br />
                <span className="text-amber-400">no espaço certo.</span>
              </h2>

              <p className="text-stone-300 text-lg leading-relaxed mb-6">
                Cada ambiente é único. Nossa equipe visita o seu local, faz as medições necessárias e projeta a solução ideal para aproveitar cada centímetro do seu espaço.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  { icon: "📐", text: "Medição precisa do seu ambiente" },
                  { icon: "🛋️", text: "Seleção personalizada de móveis" },
                  { icon: "✏️", text: "Projeto de layout sem custo adicional" },
                  { icon: "🚚", text: "Entrega e montagem incluídas" },
                ].map(({ icon, text }) => (
                  <li key={text} className="flex items-center gap-3 text-stone-300 text-sm">
                    <span className="text-lg">{icon}</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-3">
                <VisitButton />
                <p className="text-amber-400 font-medium flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Ou fale pelo chat agora 💬
                </p>
              </div>
            </div>

            {/* Right — Image */}
            <div className="relative hidden md:block">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                <Image
                  src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80"
                  alt="Atendimento personalizado"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent" />
              </div>

              {/* Floating card */}
              <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">+200 projetos</p>
                  <p className="text-gray-500 text-xs">realizados com sucesso</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
