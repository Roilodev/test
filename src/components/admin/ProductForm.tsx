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
  images?: string;
  videos?: string;
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

function parseImages(product?: ProductData): string[] {
  try {
    const arr = JSON.parse(product?.images ?? "[]");
    if (Array.isArray(arr) && arr.length > 0) return arr;
  } catch { /* empty */ }
  if (product?.imageUrl) return [product.imageUrl];
  return [];
}

function parseVideos(product?: ProductData): string[] {
  try {
    const arr = JSON.parse(product?.videos ?? "[]");
    if (Array.isArray(arr)) return arr;
  } catch { /* empty */ }
  return [];
}

export default function ProductForm({ product }: { product?: ProductData }) {
  const isEditing = !!product?.id;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [error, setError] = useState("");
  const [showSocial, setShowSocial] = useState(false);
  const [images, setImages] = useState<string[]>(() => parseImages(product));
  const [videos, setVideos] = useState<string[]>(() => parseVideos(product));
  const [previewIndex, setPreviewIndex] = useState(0);

  const [form, setForm] = useState<Omit<ProductData, "imageUrl" | "images">>({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    description: product?.description ?? "",
    price: product?.price ?? 0,
    category: product?.category ?? CATEGORIES[0],
    stock: product?.stock ?? 0,
    featured: product?.featured ?? false,
  });

  const set = (field: keyof typeof form, value: string | number | boolean) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "name" && !isEditing) updated.slug = toSlug(value as string);
      return updated;
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    setError("");
    try {
      const urls = await Promise.all(
        files.map(async (file) => {
          const fd = new FormData();
          fd.append("file", file);
          const res = await fetch("/api/upload", { method: "POST", body: fd });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error ?? "Erro ao enviar");
          return data.url as string;
        })
      );
      setImages((prev) => [...prev, ...urls]);
    } catch (err) {
      setError(String(err));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (previewIndex >= next.length) setPreviewIndex(Math.max(0, next.length - 1));
      return next;
    });
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploadingVideo(true);
    setError("");
    try {
      const urls = await Promise.all(
        files.map(async (file) => {
          const fd = new FormData();
          fd.append("file", file);
          const res = await fetch("/api/upload", { method: "POST", body: fd });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error ?? "Erro ao enviar");
          return data.url as string;
        })
      );
      setVideos((prev) => [...prev, ...urls]);
    } catch (err) {
      setError(String(err));
    } finally {
      setUploadingVideo(false);
      e.target.value = "";
    }
  };

  const removeVideo = (index: number) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) { setError("Adicione ao menos uma imagem"); return; }
    setLoading(true);
    setError("");

    const url = isEditing ? `/api/products/${product.id}` : "/api/products";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          imageUrl: images[0],
          images: JSON.stringify(images),
          videos: JSON.stringify(videos),
        }),
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

  const coverUrl = images[previewIndex] ?? images[0] ?? "";

  return (
    <>
      <form onSubmit={handleSubmit} className="flex gap-8 items-stretch">
        {/* Fields — left column */}
        <div className="flex-1 space-y-5">
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

          {/* Image gallery */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagens *
              {images.length > 0 && (
                <span className="ml-2 text-xs font-normal text-gray-400">
                  {images.length} foto{images.length !== 1 ? "s" : ""} · A primeira é a capa
                </span>
              )}
            </label>
            <div className="flex flex-wrap gap-2">
              {images.map((url, i) => (
                <div
                  key={url + i}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                    i === previewIndex ? "border-amber-500 shadow-md" : "border-gray-200 hover:border-gray-400"
                  }`}
                  onClick={() => setPreviewIndex(i)}
                >
                  <Image src={url} alt={`foto ${i + 1}`} fill className="object-cover" unoptimized />
                  {i === 0 && (
                    <span className="absolute bottom-0 left-0 right-0 bg-amber-500/80 text-white text-[10px] font-bold text-center py-0.5">
                      CAPA
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                    className="absolute top-0.5 right-0.5 bg-black/60 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {/* Add button */}
              <label className={`w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 hover:border-amber-400 flex flex-col items-center justify-center cursor-pointer transition-colors text-gray-400 hover:text-amber-500 ${uploading ? "opacity-60 pointer-events-none" : ""}`}>
                {uploading ? (
                  <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
                  </svg>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-[10px] mt-1 font-medium">Adicionar</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  multiple
                  onChange={handleUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Video gallery */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vídeos
              {videos.length > 0 && (
                <span className="ml-2 text-xs font-normal text-gray-400">{videos.length} vídeo{videos.length !== 1 ? "s" : ""}</span>
              )}
            </label>
            <div className="flex flex-wrap gap-2">
              {videos.map((url, i) => (
                <div key={url + i} className="relative w-28 h-20 rounded-lg overflow-hidden border-2 border-gray-200 bg-black group">
                  <video
                    src={url}
                    className="w-full h-full object-cover opacity-80"
                    muted
                    preload="metadata"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <svg className="w-8 h-8 text-white drop-shadow" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeVideo(i)}
                    className="absolute top-0.5 right-0.5 bg-black/60 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <label className={`w-28 h-20 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 flex flex-col items-center justify-center cursor-pointer transition-colors text-gray-400 hover:text-blue-500 ${uploadingVideo ? "opacity-60 pointer-events-none" : ""}`}>
                {uploadingVideo ? (
                  <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
                  </svg>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                    </svg>
                    <span className="text-[10px] mt-1 font-medium">Adicionar vídeo</span>
                  </>
                )}
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime,video/avi"
                  multiple
                  onChange={handleVideoUpload}
                  className="hidden"
                />
              </label>
            </div>
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
          </div>
        </div>

        {/* Image preview — right column */}
        <div className="hidden lg:flex lg:flex-col w-72 flex-shrink-0 sticky top-24">
          <div className="relative w-72 h-80 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
            {coverUrl ? (
              <Image src={coverUrl} alt="Preview" fill className="object-cover" unoptimized />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">Sem imagem</span>
              </div>
            )}
            {images.length > 1 && (
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPreviewIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === previewIndex ? "bg-white w-4" : "bg-white/50"}`}
                  />
                ))}
              </div>
            )}
          </div>

          {form.name && (
            <div className="mt-3 px-1">
              <p className="font-semibold text-gray-800 text-sm truncate">{form.name}</p>
              {form.price > 0 && <p className="text-amber-700 font-bold">${form.price.toFixed(2)}</p>}
              {images.length > 1 && (
                <p className="text-xs text-gray-400 mt-0.5">{images.length} fotos · carrusel</p>
              )}
            </div>
          )}

          <div className="mt-auto pt-2">
            {form.name && form.price > 0 && (
              <button
                type="button"
                onClick={() => setShowSocial(true)}
                className="flex items-center gap-2 border border-purple-300 text-purple-700 hover:bg-purple-50 font-medium px-4 py-2.5 rounded-lg transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Publicar nas redes
                {images.length > 1 && <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full">{images.length}</span>}
              </button>
            )}
          </div>
        </div>
      </form>

      {showSocial && (
        <SocialPostModal
          product={{ ...form, imageUrl: images[0] ?? "", images, videos }}
          onClose={() => setShowSocial(false)}
        />
      )}
    </>
  );
}
