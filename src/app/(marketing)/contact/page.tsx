import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { ContactForm } from "./contact-form";
import { HOTEL_INFO } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Hotel Nirvana Nest, Gomti Nagar, Lucknow for reservations and enquiries.",
};

export default function ContactPage() {
  return (
    <div className="section-padding pt-6">
      <div className="container-luxury">
        <SectionHeading
          eyebrow="Contact Us"
          title="We'd Love to Hear From You"
          description="Reach out for reservations, group bookings, or any questions about your stay."
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex gap-4">
                <MapPin className="size-5 shrink-0 text-primary" />
                <div>
                  <h3 className="font-heading text-sm font-semibold text-foreground">Address</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{HOTEL_INFO.address}</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex gap-4">
                <Phone className="size-5 shrink-0 text-primary" />
                <div>
                  <h3 className="font-heading text-sm font-semibold text-foreground">Phone</h3>
                  <a href={`tel:${HOTEL_INFO.phone}`} className="mt-1 block text-sm text-muted-foreground hover:text-primary">
                    {HOTEL_INFO.phone}
                  </a>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex gap-4">
                <Mail className="size-5 shrink-0 text-primary" />
                <div>
                  <h3 className="font-heading text-sm font-semibold text-foreground">Email</h3>
                  <a href={`mailto:${HOTEL_INFO.email}`} className="mt-1 block text-sm text-muted-foreground hover:text-primary">
                    {HOTEL_INFO.email}
                  </a>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex gap-4">
                <Clock className="size-5 shrink-0 text-primary" />
                <div>
                  <h3 className="font-heading text-sm font-semibold text-foreground">Hours</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Front Desk: 24x7 · Check-in {HOTEL_INFO.checkInTime} · Check-out {HOTEL_INFO.checkOutTime}
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border">
              <iframe
                title="Hotel Nirvana Nest location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14237.41376517361!2d81.016853!3d26.8605096!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399be36cbe210b5b%3A0x461630efed8f420e!2sHotel%20Nirvana%20Nest!5e0!3m2!1sen!2sin!4v1782145702624!5m2!1sen!2sin"
                className="h-64 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
