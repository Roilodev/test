import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, address, date, timeSlot, notes } = body;

    if (!name || !email || !phone || !address || !date || !timeSlot) {
      return NextResponse.json({ error: "Todos os campos obrigatórios devem ser preenchidos" }, { status: 400 });
    }

    const visit = await prisma.visit.create({
      data: { name, email, phone, address, date, timeSlot, notes: notes ?? "" },
    });

    return NextResponse.json(visit, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function GET() {
  const visits = await prisma.visit.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(visits);
}
