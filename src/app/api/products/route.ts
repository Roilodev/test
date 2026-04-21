import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const { name, slug, description, price, imageUrl, images, videos, category, stock, featured } = body;

  if (!name || !slug || !description || !imageUrl || !category) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }

  try {
    const product = await prisma.product.create({
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
    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json({ error: "El slug ya existe" }, { status: 409 });
  }
}
