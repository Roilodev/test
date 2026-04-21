import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const apiKey = process.env.UPLOAD_POST_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "UPLOAD_POST_API_KEY não configurada" }, { status: 500 });
  }

  let body: { imageUrls?: string[]; videoUrls?: string[]; caption?: string; platforms?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const { imageUrls, videoUrls, caption, platforms } = body;

  if ((!imageUrls || imageUrls.length === 0) || !caption || !platforms || platforms.length === 0) {
    return NextResponse.json({ error: "imageUrls, caption e platforms são obrigatórios" }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3001";

  async function downloadFile(url: string, label: string) {
    const fullUrl = url.startsWith("/") ? `${baseUrl}${url}` : url;
    const res = await fetch(fullUrl);
    if (!res.ok) throw new Error(`Não foi possível baixar ${label}: HTTP ${res.status}`);
    const buffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") || "application/octet-stream";
    return { buffer, contentType };
  }

  const formData = new FormData();
  formData.append("user", "muebleria-moderna");
  formData.append("title", caption);
  for (const platform of platforms) {
    formData.append("platform[]", platform);
  }

  for (let i = 0; i < imageUrls!.length; i++) {
    try {
      const { buffer, contentType } = await downloadFile(imageUrls![i], `imagem ${i + 1}`);
      const ext = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";
      formData.append("photos[]", new Blob([buffer], { type: contentType }), `photo_${i + 1}.${ext}`);
    } catch (err) {
      return NextResponse.json({ error: String(err) }, { status: 400 });
    }
  }

  for (let i = 0; i < (videoUrls?.length ?? 0); i++) {
    try {
      const { buffer, contentType } = await downloadFile(videoUrls![i], `vídeo ${i + 1}`);
      const ext = contentType.includes("webm") ? "webm" : contentType.includes("quicktime") ? "mov" : "mp4";
      formData.append("videos[]", new Blob([buffer], { type: contentType }), `video_${i + 1}.${ext}`);
    } catch (err) {
      return NextResponse.json({ error: String(err) }, { status: 400 });
    }
  }

  try {
    const res = await fetch("https://api.upload-post.com/api/upload_photos", {
      method: "POST",
      headers: { Authorization: `Apikey ${apiKey}` },
      body: formData,
    });

    const text = await res.text();
    let data: unknown;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    if (!res.ok) return NextResponse.json({ error: data }, { status: res.status });
    return NextResponse.json({ ok: true, data });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
