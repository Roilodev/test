import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id: parseInt(id) } });
  if (!product) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { name, slug, description, price, imageUrl, images, videos, category, stock, featured } = body;

  if (!name || !slug || !description || !imageUrl || !category) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }

  try {
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
        imageUrl,
        images: images ?? JSON.stringify([imageUrl]),
        videos: videos ?? "[]",
        category,
        stock: parseInt(stock) || 0,
        featured: Boolean(featured),
      },
    });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  await prisma.product.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}
