"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/CartContext";

type Product = {
  id: number;
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
};

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative h-52 bg-gray-100 overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-gray-800 font-bold px-3 py-1 rounded-full text-sm">
                Sin stock
              </span>
            </div>
          )}
          <div className="absolute top-2 left-2">
            <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-full">
              {product.category}
            </span>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 hover:text-amber-700 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xl font-bold text-amber-700">${product.price.toFixed(2)}</span>
          <button
            onClick={() =>
              addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                slug: product.slug,
              })
            }
            disabled={product.stock === 0}
            className="bg-amber-700 hover:bg-amber-800 disabled:bg-gray-300 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            {product.stock === 0 ? "Agotado" : "Agregar"}
          </button>
        </div>
      </div>
    </div>
  );
}
