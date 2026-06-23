"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, Globe, Camera, X as Twitter } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { HOTEL_INFO } from "@/lib/constants";

export function Footer() {
  const { t } = useTranslation();

  const quickLinks = [
    { href: "/rooms", label: t.nav.rooms },
    { href: "/restaurant", label: t.nav.restaurant },
    { href: "/gallery", label: t.nav.gallery },
    { href: "/about", label: t.nav.about },
    { href: "/faq", label: t.nav.faq },
    { href: "/contact", label: t.nav.contact },
  ];

  return (
    <footer className="border-t border-border bg-card/40">
      <div className="container-luxury grid gap-10 px-6 py-16 md:grid-cols-2 lg:grid-cols-4 lg:px-10">
        <div>
          <span className="font-heading text-2xl font-bold text-gradient-gold">Nirvana Nest</span>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            A sanctuary of modern luxury in the heart of Gomti Nagar, Lucknow — where elegant
            stays meet exceptional dining.
          </p>
          <div className="mt-5 flex gap-3">
            {[Globe, Camera, Twitter].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex size-9 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors hover:border-primary hover:text-primary"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-heading text-base font-semibold text-foreground">{t.footer.quickLinks}</h4>
          <ul className="mt-4 space-y-2.5">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-base font-semibold text-foreground">{t.footer.contact}</h4>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2.5">
              <MapPin className="size-4 shrink-0 text-primary" />
              <span>{HOTEL_INFO.address}</span>
            </li>
            <li className="flex gap-2.5">
              <Phone className="size-4 shrink-0 text-primary" />
              <a href={`tel:${HOTEL_INFO.phone}`} className="hover:text-primary">
                {HOTEL_INFO.phone}
              </a>
            </li>
            <li className="flex gap-2.5">
              <Mail className="size-4 shrink-0 text-primary" />
              <a href={`mailto:${HOTEL_INFO.email}`} className="hover:text-primary">
                {HOTEL_INFO.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-base font-semibold text-foreground">Hours</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>Front Desk: 24 x 7</li>
            <li>
              Check-in {HOTEL_INFO.checkInTime} · Check-out {HOTEL_INFO.checkOutTime}
            </li>
            <li>
              Restaurant: {HOTEL_INFO.restaurantOpenTime} - {HOTEL_INFO.restaurantCloseTime}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {HOTEL_INFO.name}. {t.footer.rights}
      </div>
    </footer>
  );
}
