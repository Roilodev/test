import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { status } = await req.json();

  const visit = await prisma.visit.update({
    where: { id: Number(id) },
    data: { status },
  });

  return NextResponse.json(visit);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.visit.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
