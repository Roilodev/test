"use client";

import { useState } from "react";
import Image from "next/image";

type MediaItem = { type: "image" | "video"; url: string };

export default function ProductGallery({ images, videos }: { images: string[]; videos: string[] }) {
  const media: MediaItem[] = [
    ...images.map((url) => ({ type: "image" as const, url })),
    ...videos.map((url) => ({ type: "video" as const, url })),
  ];

  const [current, setCurrent] = useState(0);

  if (media.length === 0) return null;

  const item = media[current];

  return (
    <div className="flex flex-col h-full">
      {/* Main display */}
      <div className="relative flex-1 min-h-72 md:min-h-96 bg-gray-100">
        {item.type === "image" ? (
          <Image src={item.url} alt="Produto" fill className="object-cover" unoptimized priority={current === 0} />
        ) : (
          <video
            key={item.url}
            src={item.url}
            controls
            className="absolute inset-0 w-full h-full object-contain bg-black"
          />
        )}

        {/* Arrows */}
        {media.length > 1 && (
          <>
            <button
              onClick={() => setCurrent((i) => (i - 1 + media.length) % media.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-9 h-9 flex items-center justify-center transition-colors"
            >
              ‹
            </button>
            <button
              onClick={() => setCurrent((i) => (i + 1) % media.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-9 h-9 flex items-center justify-center transition-colors"
            >
              ›
            </button>
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
              {media.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all ${i === current ? "bg-white w-4 h-2" : "bg-white/50 w-2 h-2"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {media.length > 1 && (
        <div className="flex gap-2 p-3 bg-gray-50 border-t overflow-x-auto">
          {media.map((m, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                i === current ? "border-amber-500" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              {m.type === "image" ? (
                <Image src={m.url} alt={`foto ${i + 1}`} fill className="object-cover" unoptimized />
              ) : (
                <div className="w-full h-full bg-black flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
