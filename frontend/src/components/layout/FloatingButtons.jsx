import { WhatsappLogo, Phone } from "@phosphor-icons/react";
import { SCHOOL } from "@/lib/api";

export default function FloatingButtons() {
  return (
    <div className="fixed left-6 bottom-6 z-40 flex flex-col gap-3">
      <a
        data-testid="floating-whatsapp"
        href={`https://wa.me/91${SCHOOL.phones[0].replace(/\D/g, "").slice(-10)}`}
        target="_blank"
        rel="noreferrer"
        className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-xl shadow-green-500/40 flex items-center justify-center floaty"
        aria-label="WhatsApp"
      >
        <WhatsappLogo size={24} weight="fill" />
      </a>
      <a
        data-testid="floating-call"
        href={`tel:${SCHOOL.phones[0].replace(/\s/g, "")}`}
        className="w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-600 text-[#1E3A8A] shadow-xl shadow-amber-500/40 flex items-center justify-center"
        aria-label="Call"
      >
        <Phone size={22} weight="fill" />
      </a>
    </div>
  );
}
