import { MapPin, Phone, MessageCircle, Mail } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { contactInfo, socialLinks } from "@/data/site";
import Button from "@/components/ui/Button";

const scheduleKeys = ["weekdays", "saturday", "sunday"] as const;

export default async function ContactInfo() {
  const t = await getTranslations("ContactInfo");

  return (
    <div>
      <p className="text-xs font-semibold tracking-widest text-neutral-500">
        LOS LEONES MMA
      </p>
      <h2 className="mt-2 text-2xl font-extrabold text-white">
        {t("title")}
      </h2>

      <div className="mt-8 space-y-6">
        <div className="flex items-start gap-3">
          <MapPin size={18} className="mt-0.5 text-orange-500" />
          <div>
            <p className="text-xs font-semibold tracking-widest text-neutral-500">
              {t("address")}
            </p>
            <p className="mt-1 text-sm text-neutral-300">
              {contactInfo.address}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Phone size={18} className="mt-0.5 text-orange-500" />
          <div>
            <p className="text-xs font-semibold tracking-widest text-neutral-500">
              {t("phone")}
            </p>
            <a
              href={`tel:${contactInfo.phone}`}
              className="mt-1 block text-sm text-orange-500 hover:text-orange-400"
            >
              {contactInfo.phone}
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MessageCircle size={18} className="mt-0.5 text-orange-500" />
          <div>
            <p className="text-xs font-semibold tracking-widest text-neutral-500">
              WHATSAPP
            </p>
            <a
              href={`https://wa.me/${contactInfo.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block text-sm text-orange-500 hover:text-orange-400"
            >
              {contactInfo.whatsappNumber}
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Mail size={18} className="mt-0.5 text-orange-500" />
          <div>
            <p className="text-xs font-semibold tracking-widest text-neutral-500">
              EMAIL
            </p>
            <a
              href={`mailto:${contactInfo.email}`}
              className="mt-1 block text-sm text-orange-500 hover:text-orange-400"
            >
              {contactInfo.email}
            </a>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <p className="text-xs font-semibold tracking-widest text-neutral-500">
          {t("availability")}
        </p>
        <div className="mt-3 space-y-2">
          {scheduleKeys.map((key) => (
            <div
              key={key}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-neutral-400">
                {t(`schedule.${key}.day`)}
              </span>
              <span className="text-neutral-300">
                {t(`schedule.${key}.hours`)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Button href={`mailto:${contactInfo.email}`}>{t("contactUs")}</Button>
        <Button href="/candidater" variant="outline">
          {t("join")}
        </Button>
      </div>

      <div className="mt-10 border-t border-white/10 pt-6">
        <p className="text-xs font-semibold tracking-widest text-orange-500">
          {t("social")}
        </p>
        <div className="mt-3 flex flex-wrap gap-4">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-neutral-400 hover:text-orange-500"
            >
              {social.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}