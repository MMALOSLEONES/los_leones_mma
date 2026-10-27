"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { mockGallery } from "@/components/data/mock-gallery";

export default function GallerySection() {
  const t = useTranslations("GallerySection");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const close = () => setSelectedIndex(null);
  const showPrev = () =>
    setSelectedIndex((i) =>
      i === null ? null : (i - 1 + mockGallery.length) % mockGallery.length
    );
  const showNext = () =>
    setSelectedIndex((i) => (i === null ? null : (i + 1) % mockGallery.length));

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 lg:px-8">
      <p className="text-xs font-semibold tracking-[0.3em] text-orange-500">
        {t("eyebrow")}
      </p>
      <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
        {t("title")}
      </h2>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {mockGallery.map((image, index) => (
          <button
            key={image.id}
            onClick={() => setSelectedIndex(index)}
            aria-label={t("enlarge", { alt: image.alt })}
            className={`aspect-square overflow-hidden rounded-md bg-[linear-gradient(160deg,#3a3a3a,#0a0a0a)] transition hover:opacity-80 ${
              index === 0 ? "col-span-2 row-span-2 aspect-auto" : ""
            }`}
          />
        ))}
      </div>

      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={close}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            aria-label={t("previous")}
            className="absolute left-4 text-3xl text-white/70 hover:text-white"
          >
            ‹
          </button>

          <div
            className="aspect-video w-full max-w-3xl rounded-md bg-[linear-gradient(160deg,#3a3a3a,#0a0a0a)]"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            aria-label={t("next")}
            className="absolute right-4 text-3xl text-white/70 hover:text-white"
          >
            ›
          </button>

          <button
            onClick={close}
            aria-label={t("close")}
            className="absolute right-4 top-4 text-2xl text-white/70 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}
    </section>
  );
}