import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const apiKey = process.env.UPLOAD_POST_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "UPLOAD_POST_API_KEY no configurada" }, { status: 500 });
  }

  let body: { imageUrl?: string; caption?: string; platforms?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const { imageUrl, caption, platforms } = body;

  if (!imageUrl || !caption || !platforms || platforms.length === 0) {
    return NextResponse.json({ error: "imageUrl, caption y platforms son requeridos" }, { status: 400 });
  }

  // Download the product image server-side
  let imageBuffer: ArrayBuffer;
  let contentType = "image/jpeg";
  try {
    const imgRes = await fetch(imageUrl);
    if (!imgRes.ok) throw new Error(`HTTP ${imgRes.status}`);
    imageBuffer = await imgRes.arrayBuffer();
    contentType = imgRes.headers.get("content-type") || "image/jpeg";
  } catch (err) {
    return NextResponse.json({ error: `No se pudo descargar la imagen: ${String(err)}` }, { status: 400 });
  }

  // Build multipart FormData
  const formData = new FormData();
  formData.append("user", "muebleria-moderna");
  formData.append("title", caption);

  for (const platform of platforms) {
    formData.append("platform[]", platform);
  }

  // Determine file extension from content-type
  const ext = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";
  const blob = new Blob([imageBuffer], { type: contentType });
  formData.append("photos[]", blob, `product.${ext}`);

  try {
    const res = await fetch("https://api.upload-post.com/api/upload_photos", {
      method: "POST",
      headers: {
        Authorization: `Apikey ${apiKey}`,
      },
      body: formData,
    });

    const text = await res.text();
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (!res.ok) {
      return NextResponse.json({ error: data }, { status: res.status });
    }

    return NextResponse.json({ ok: true, data });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
