"use client";

import { useCart } from "./CartContext";
import { cartTotal } from "@/lib/cart";
import Image from "next/image";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CartDrawer({ open, onClose }: Props) {
  const { cart, removeItem, updateItem } = useCart();
  const total = cartTotal(cart);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="cart-overlay absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="cart-drawer absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold text-gray-900">Carrinho de compras</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="font-medium">Seu carrinho está vazio</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 bg-gray-50 rounded-lg p-3">
                  <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-200">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">{item.name}</p>
                    <p className="text-amber-700 font-bold text-sm">${item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => updateItem(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateItem(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1 text-gray-400 hover:text-red-500 self-start"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="p-4 border-t bg-white">
              <div className="flex justify-between mb-1 text-sm text-gray-600">
                <span>Subtotal</span>

                <span>${total.toFixed(2)}</span>
              </div>
              {total >= 500 && (
                <div className="flex justify-between mb-2 text-sm text-green-600">
                  <span>Frete</span>
                  <span>Grátis</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg mb-4">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button className="w-full bg-amber-700 hover:bg-amber-800 text-white font-bold py-3 rounded-lg transition-colors">
                Finalizar compra
              </button>
              {total < 500 && (
                <p className="text-center text-xs text-gray-500 mt-2">
                  Adicione ${(500 - total).toFixed(2)} a mais para frete grátis
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
