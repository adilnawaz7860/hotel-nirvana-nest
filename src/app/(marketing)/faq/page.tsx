import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/section-heading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HOTEL_INFO } from "@/lib/constants";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about booking rooms and tables at Hotel Nirvana Nest.",
};

const faqs = [
  {
    q: "What are the check-in and check-out times?",
    a: `Check-in begins at ${HOTEL_INFO.checkInTime} and check-out is until ${HOTEL_INFO.checkOutTime}. Early check-in and late check-out are subject to availability.`,
  },
  {
    q: "What is your cancellation policy?",
    a: "Bookings cancelled more than 72 hours before check-in receive a full refund. Cancellations between 24-72 hours receive a 50% refund. Cancellations within 24 hours of check-in are non-refundable.",
  },
  {
    q: "Is online payment secure?",
    a: "Yes, all payments are processed securely through Razorpay, supporting cards, UPI, net banking and wallets.",
  },
  {
    q: "Can I modify my room booking dates?",
    a: "Currently, date changes require cancelling the existing booking (subject to the cancellation policy) and creating a new booking. Contact our front desk for assistance.",
  },
  {
    q: "Do you offer table reservations without prior booking?",
    a: "While walk-ins are welcome, we recommend reserving a table in advance, especially for weekends and family gatherings, to guarantee availability.",
  },
  {
    q: "Is parking available at the hotel?",
    a: "Yes, complimentary parking is available for all registered guests.",
  },
  {
    q: "Do you allow pets?",
    a: "Please contact our front desk in advance to check pet policy and availability for your stay.",
  },
];

export default function FaqPage() {
  return (
    <div className="section-padding pt-6">
      <div className="container-luxury max-w-3xl">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently Asked Questions"
          description="Everything you need to know about booking your stay or table at Hotel Nirvana Nest."
        />

        <Accordion className="mt-12">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-border">
              <AccordionTrigger className="text-left font-heading text-base">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
