import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { CartProvider } from "@/components/cart/CartContext";
import ChatWidget from "@/components/chat/ChatWidget";

export const metadata: Metadata = {
  title: "Mueblería Moderna",
  description: "Muebles de alta calidad para tu hogar",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-50">
        <CartProvider>
          <Navbar />
          <main className="pt-16">{children}</main>
          <ChatWidget />
        </CartProvider>
      </body>
    </html>
  );
}
