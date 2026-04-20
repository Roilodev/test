"use client";

import { useState } from "react";
import Image from "next/image";

type ProductData = {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  slug: string;
};

type Network = "facebook" | "twitter" | "linkedin" | "pinterest" | "instagram";

const NETWORKS: { id: Network; label: string; color: string; icon: React.ReactNode }[] = [
  {
    id: "instagram",
    label: "Instagram",
    color: "bg-pink-500 hover:bg-pink-600 border-pink-500",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    id: "facebook",
    label: "Facebook",
    color: "bg-blue-600 hover:bg-blue-700 border-blue-600",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    id: "twitter",
    label: "X / Twitter",
    color: "bg-black hover:bg-gray-800 border-black",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    color: "bg-blue-700 hover:bg-blue-800 border-blue-700",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 .774 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    id: "pinterest",
    label: "Pinterest",
    color: "bg-red-600 hover:bg-red-700 border-red-600",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
      </svg>
    ),
  },
];

function toHashtag(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "");
}

function generateCaption(product: ProductData, productUrl: string): string {
  const { name, description, price, category } = product;
  const catTag = toHashtag(category);
  return `✨ ${name} — $${price.toFixed(2)}\n\n${description}\n\n📦 Categoria: ${category}\n🚚 Frete grátis em compras acima de $500\n🛡️ Garantia 2 anos\n\n👉 ${productUrl}\n\n#moveis #lar #decoracao #${catTag} #movelariamoderna`;
}

type Props = {
  product: ProductData;
  onClose: () => void;
};

type PublishStatus = "idle" | "loading" | "success" | "error";

export default function SocialPostModal({ product, onClose }: Props) {
  const productUrl = `${typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"}/products/${product.slug}`;

  const [caption, setCaption] = useState(() => generateCaption(product, productUrl));
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<Network>>(new Set());
  const [status, setStatus] = useState<PublishStatus>("idle");
  const [statusMsg, setStatusMsg] = useState("");
  const [copied, setCopied] = useState(false);

  const togglePlatform = (id: Network) => {
    setSelectedPlatforms((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePublish = async () => {
    if (selectedPlatforms.size === 0) {
      setStatusMsg("Selecione ao menos uma rede social.");
      setStatus("error");
      return;
    }
    if (!product.imageUrl) {
      setStatusMsg("O produto não tem imagem configurada.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setStatusMsg("");

    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: product.imageUrl,
          caption,
          platforms: Array.from(selectedPlatforms),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errMsg = typeof data.error === "string"
          ? data.error
          : JSON.stringify(data.error);
        setStatusMsg(errMsg);
        setStatus("error");
      } else {
        setStatus("success");
        setStatusMsg("Publicação enviada com sucesso!");
      }
    } catch (err) {
      setStatusMsg(String(err));
      setStatus("error");
    }
  };

  const charCount = caption.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Publicar nas redes sociais</h2>
            <p className="text-sm text-gray-500 mt-0.5 truncate max-w-sm">{product.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Platform checkboxes */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Selecione as redes onde publicar</p>
            <div className="flex flex-wrap gap-2">
              {NETWORKS.map((n) => {
                const checked = selectedPlatforms.has(n.id);
                return (
                  <button
                    type="button"
                    key={n.id}
                    onClick={() => togglePlatform(n.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                      checked
                        ? `${n.color} text-white shadow-md`
                        : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white"
                    }`}
                  >
                    {n.icon}
                    {n.label}
                    {checked && (
                      <svg className="w-4 h-4 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Image preview */}
          {product.imageUrl && (
            <div className="flex items-start gap-4 bg-gray-50 rounded-xl border border-gray-200 p-4">
              <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                <Image src={product.imageUrl} alt={product.name} fill className="object-cover" unoptimized />
              </div>
              <div className="text-sm text-gray-600">
                <p className="font-semibold text-gray-800 mb-1">{product.name}</p>
                <p className="text-gray-500">${product.price.toFixed(2)} · {product.category}</p>
              </div>
            </div>
          )}

          {/* Caption editor */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-semibold text-gray-700">Texto da publicação</label>
              <span className="text-xs text-gray-400 font-mono">{charCount} caracteres</span>
            </div>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={8}
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-y leading-relaxed"
            />
          </div>

          {/* Status messages */}
          {status === "success" && (
            <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 px-4 py-3 rounded-xl text-sm font-medium">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {statusMsg}
            </div>
          )}

          {status === "error" && (
            <div className="text-red-700 bg-red-50 border border-red-200 px-4 py-3 rounded-xl text-sm">
              <span className="font-semibold">Erro: </span>{statusMsg}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={handlePublish}
              disabled={status === "loading" || status === "success"}
              className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors"
            >
              {status === "loading" ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
                  </svg>
                  Publicando...
                </>
              ) : status === "success" ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Publicado
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Publicar agora
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-4 py-3 rounded-xl transition-colors"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-green-600">¡Copiado!</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copiar texto

                </>
              )}
            </button>
          </div>

          <p className="text-xs text-gray-400 text-center">
            A publicação será enviada para as contas conectadas no seu perfil de upload-post.com
          </p>
        </div>
      </div>
    </div>
  );
}
