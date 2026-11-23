import Image from "next/image";
import { useTranslations } from "next-intl";

const partners = [
  {
    id: "aemma",
    image: "/images/partners/aemma.jpg",
    name: "AEMMA",
    alt: "AEMMA España",
  },
  {
    id: "chinto",
    image: "/images/partners/chintomordillo.jpg",
    name: "CHINTO MORDILLO",
    alt: "Chinto Mordillo",
  },
  {
    id: "wkba",
    image: "/images/partners/wkba.png",
    name: "WKBA",
    alt: "World Kickboxing Association",
  },
];

export default function HomePartner() {
  const t = useTranslations("HomePartner");

  return (
    <section className="border-y border-neutral-900 bg-[#050505] px-5 py-8 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="text-center sm:text-left">
          <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#ff6500]">
            {t("eyebrow")}
          </p>

          <h2 className="mt-2 text-sm font-bold uppercase tracking-wide text-white sm:text-base">
            {t("title")}
          </h2>

          <p className="mt-1 text-xs text-neutral-500">{t("description")}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className={`flex items-center gap-3 ${
                partner.id === "chinto" ? "sm:ml-10" : ""
              }`}
            >
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-sm bg-white p-1">
                <Image
                  src={partner.image}
                  alt={partner.alt}
                  width={437}
                  height={437}
                  className="h-full w-full object-contain"
                />
              </div>

              <p className="max-w-[110px] text-[10px] font-bold uppercase leading-relaxed text-white sm:text-xs">
                {partner.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
