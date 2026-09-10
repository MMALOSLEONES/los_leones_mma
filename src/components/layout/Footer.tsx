import Link from "next/link";
import { footerLinks, contactInfo, socialLinks } from "@/data/site";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Logo + adresse */}
          <div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full border border-white/40" />
              <div>
                <p className="text-sm font-bold tracking-wide text-white">
                  LOS LEONES
                </p>
                <p className="text-[10px] tracking-widest text-neutral-400">
                  MIXED MARTIAL ARTS CLUB — SENEGAL
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm text-neutral-400">
              {contactInfo.address}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest text-orange-500">
              NAVIGATION
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-300 transition hover:text-orange-500"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest text-orange-500">
              CONTACT
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-neutral-300">
              <li>{contactInfo.city}</li>
              <li>
                <a href={`tel:${contactInfo.phone}`} className="hover:text-orange-500">
                  {contactInfo.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${contactInfo.email}`} className="hover:text-orange-500">
                  {contactInfo.email}
                </a>
              </li>
              <li>
                <WhatsAppButton />
              </li>
            </ul>
          </div>

          {/* Réseaux */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest text-orange-500">
              RÉSEAUX
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-neutral-300">
              {socialLinks.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-orange-500"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-6">
          <p className="text-xs text-neutral-500">
            © 2026 Los Leones MMA Senegal. Tous droits réservés.
          </p>
        </div>
      </div>

      <WhatsAppButton variant="floating" />
    </footer>
  );
}