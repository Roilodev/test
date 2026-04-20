export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) },
  });

  if (!product) notFound();

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin" className="hover:text-amber-700">Productos</Link>
        <span>/</span>
        <span className="text-gray-900 truncate max-w-48">{product.name}</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Editar producto</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <ProductForm product={product} />
      </div>
    </div>
  );
}
