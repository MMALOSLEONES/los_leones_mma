import { MapPin } from "lucide-react";
import { contactInfo } from "@/data/site";

export default function ContactMap() {
  return (
    <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-md border border-white/10 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px] lg:aspect-auto lg:h-full">
      <div className="text-center">
        <MapPin className="mx-auto text-orange-500" size={28} />
        <p className="mt-2 text-sm font-bold tracking-wide text-white">
          DAKAR, SÉNÉGAL
        </p>
        <p className="mt-1 text-xs text-neutral-500">{contactInfo.address}</p>
        <p className="mt-4 text-[10px] font-semibold tracking-widest text-neutral-600">
          CARTE À VENIR
        </p>
      </div>
    </div>
  );
}
