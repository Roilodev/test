import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.UPLOAD_POST_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "UPLOAD_POST_API_KEY no configurada" }, { status: 500 });
  }

  try {
    const res = await fetch("https://api.upload-post.com/api/profiles", {
      headers: {
        Authorization: `Apikey ${apiKey}`,
      },
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
