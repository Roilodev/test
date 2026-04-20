"use client";

import { useCart } from "@/components/cart/CartContext";

type Product = {
  id: number;
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
  stock: number;
};

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
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
      className="w-full bg-amber-700 hover:bg-amber-800 disabled:bg-gray-300 text-white font-bold py-3 rounded-xl transition-colors text-sm"
    >
      {product.stock === 0 ? "Sin stock" : "Agregar al carrito"}
    </button>
  );
}
