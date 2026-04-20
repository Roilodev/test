import Link from "next/link";
import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin" className="hover:text-amber-700">Productos</Link>
        <span>/</span>
        <span className="text-gray-900">Nuevo producto</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Crear nuevo producto</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <ProductForm />
      </div>
    </div>
  );
}
