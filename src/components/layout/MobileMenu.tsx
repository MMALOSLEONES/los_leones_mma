"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { footerLinks, contactInfo, socialLinks } from "@/data/site";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-black px-6 py-6 lg:hidden">
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold tracking-wide text-white">
          LOS LEONES
        </span>
        <button
          onClick={onClose}
          aria-label="Fermer le menu"
          className="text-white"
        >
          <X size={28} />
        </button>
      </div>

      <p className="mt-2 text-sm text-neutral-400">{contactInfo.address}</p>

      <div className="mt-10">
        <h3 className="text-xs font-semibold tracking-widest text-orange-500">
          NAVIGATION
        </h3>
        <ul className="mt-4 space-y-4">
          {footerLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onClose}
                className="text-lg text-neutral-200 transition hover:text-orange-500"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10">
        <h3 className="text-xs font-semibold tracking-widest text-orange-500">
          CONTACT
        </h3>
        <ul className="mt-4 space-y-3 text-neutral-300">
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

      <div className="mt-10">
        <h3 className="text-xs font-semibold tracking-widest text-orange-500">
          RÉSEAUX
        </h3>
        <ul className="mt-4 space-y-3">
          {socialLinks.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-300 hover:text-orange-500"
              >
                {social.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
