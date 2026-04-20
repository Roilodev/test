"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import SocialPostModal from "./SocialPostModal";

type ProductData = {
  id?: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  featured: boolean;
};

const CATEGORIES = ["Sofás", "Camas", "Mesas", "Cadeiras", "Armazenamento", "Escrivaninhas", "Iluminação"];

function toSlug(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function ProductForm({ product }: { product?: ProductData }) {
  const isEditing = !!product?.id;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSocial, setShowSocial] = useState(false);

  const [form, setForm] = useState<ProductData>({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    description: product?.description ?? "",
    price: product?.price ?? 0,
    imageUrl: product?.imageUrl ?? "",
    category: product?.category ?? CATEGORIES[0],
    stock: product?.stock ?? 0,
    featured: product?.featured ?? false,
  });

  const set = (field: keyof ProductData, value: string | number | boolean) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "name" && !isEditing) updated.slug = toSlug(value as string);
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = isEditing ? `/api/products/${product.id}` : "/api/products";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erro ao salvar");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
          <input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
          <input
            value={form.slug}
            onChange={(e) => set("slug", e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-gray-50"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
        <textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          required
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
        />
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Preço ($) *</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => set("price", parseFloat(e.target.value) || 0)}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estoque *</label>
          <input
            type="number"
            min="0"
            value={form.stock}
            onChange={(e) => set("stock", parseInt(e.target.value) || 0)}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
          >
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">URL da imagem *</label>
        <input
          value={form.imageUrl}
          onChange={(e) => set("imageUrl", e.target.value)}
          placeholder="https://..."
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        {form.imageUrl && (
          <div className="mt-2 relative h-32 w-32 rounded-lg overflow-hidden bg-gray-100">
            <Image src={form.imageUrl} alt="Preview" fill className="object-cover" unoptimized />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="featured"
          checked={form.featured}
          onChange={(e) => set("featured", e.target.checked)}
          className="w-4 h-4 text-amber-600 rounded focus:ring-amber-400"
        />
        <label htmlFor="featured" className="text-sm font-medium text-gray-700">
          Produto em destaque (aparece na página inicial)
        </label>
      </div>

      {error && (
        <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>
      )}

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-amber-700 hover:bg-amber-800 disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-lg transition-colors text-sm"
        >
          {loading ? "Salvando..." : isEditing ? "Salvar alterações" : "Criar produto"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-6 py-2.5 rounded-lg transition-colors text-sm"
        >
          Cancelar
        </button>

        {/* Botón publicar en redes — solo si hay nombre y precio */}
        {form.name && form.price > 0 && (
          <button
            type="button"
            onClick={() => setShowSocial(true)}
            className="ml-auto flex items-center gap-2 border border-purple-300 text-purple-700 hover:bg-purple-50 font-medium px-4 py-2.5 rounded-lg transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Publicar nas redes
          </button>
        )}
      </div>

    </form>

      {showSocial && (
        <SocialPostModal
          product={form}
          onClose={() => setShowSocial(false)}
        />
      )}
    </>
  );
}
