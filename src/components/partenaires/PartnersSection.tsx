
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function PartnersSection() {
  const t = useTranslations("CurrentPartners");

  const partners = [
    {
      id: "aemma",
      image: "/images/partners/aemma.jpg",
      alt: t("partners.aemma.alt"),
      name: "AEMMA",
      country: "– ESPAÑA",
      subtitle: "Asociación Española de MMA",
      description: t("partners.aemma.description"),
    },
    {
      id: "chinto",
      image: "/images/partners/chintomordillo.jpg",
      alt: t("partners.chinto.alt"),
      name: "CHINTO MORDILLO",
      country: "",
      subtitle: t("partners.chinto.subtitle"),
      description: t("partners.chinto.description"),
    },
    {
      id: "wkba",
      image: "/images/partners/wkba.png",
      alt: t("partners.wkba.alt"),
      name: "WKBA",
      country: "",
      subtitle: "World Kickboxing Association",
      description: t("partners.wkba.description"),
    },
  ];

  return (
    <section className="bg-[#050505] px-5 py-20 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#ff6500]">
            {t("eyebrow")}
          </p>

          <h2 className="mt-3 text-3xl font-black uppercase text-white sm:text-4xl">
            {t("title")}
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-400 sm:text-base">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {partners.map((partner) => (
            <article
              key={partner.id}
              className="group flex flex-col overflow-hidden border border-neutral-800 bg-neutral-900/20 transition-colors duration-300 hover:border-neutral-700"
            >
              <div className="flex h-56 items-center justify-center overflow-hidden bg-neutral-900 p-8">
                <Image
                  src={partner.image}
                  alt={partner.alt}
                  width={437}
                  height={437}
                  className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-1 flex-col p-6">
                <span className="mb-5 w-fit border border-[#ff6500]/40 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-[#ff6500]">
                  {t("partnerLabel")}
                </span>

                <h3 className="text-xl font-black uppercase text-white">
                  {partner.name}{" "}
                  <span className="text-[#ff6500]">{partner.country}</span>
                </h3>

                <p className="mt-3 text-sm font-medium text-neutral-400">
                  {partner.subtitle}
                </p>

                <div className="my-5 h-px w-12 bg-[#ff6500]" />

                <p className="text-sm leading-7 text-neutral-400">
                  {partner.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
