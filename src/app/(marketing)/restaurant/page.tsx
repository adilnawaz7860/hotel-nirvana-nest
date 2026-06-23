import type { Metadata } from "next";
import Link from "next/link";
import { SafeImage } from "@/components/shared/safe-image";
import { SectionHeading } from "@/components/shared/section-heading";
import { ReservationWidget } from "@/components/restaurant/reservation-widget";
import { Button } from "@/components/ui/button";
import { HOTEL_MEDIA } from "@/lib/constants/media";
import { HOTEL_INFO } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Restaurant - Nirvana Foodhall",
  description:
    "Reserve a table at Nirvana Foodhall, the multi-cuisine restaurant at Hotel Nirvana Nest, Gomti Nagar, Lucknow.",
};

export default function RestaurantPage() {
  return (
    <div className="section-padding pt-6">
      <div className="container-luxury">
        <SectionHeading
          eyebrow="Nirvana Foodhall"
          title="Fine Dining at Hotel Nirvana Nest"
          description={`Open daily from ${HOTEL_INFO.restaurantOpenTime} to ${HOTEL_INFO.restaurantCloseTime}, our restaurant offers a refined multi-cuisine menu in an elegant, comfortable setting.`}
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative col-span-2 h-64 overflow-hidden rounded-2xl border border-border">
              <SafeImage src={HOTEL_MEDIA.restaurant[3]} alt="Nirvana Foodhall" fill sizes="50vw" className="object-cover" />
            </div>
            <div className="relative h-40 overflow-hidden rounded-2xl border border-border">
              <SafeImage src={HOTEL_MEDIA.restaurant[0]} alt="Restaurant interior" fill sizes="25vw" className="object-cover" />
            </div>
            <div className="relative h-40 overflow-hidden rounded-2xl border border-border">
              <SafeImage src={HOTEL_MEDIA.restaurant[2]} alt="Restaurant seating" fill sizes="25vw" className="object-cover" />
            </div>

            <div className="col-span-2 mt-2">
              <Button
                variant="outline"
                nativeButton={false}
                className="border-primary/40 hover:bg-primary/10"
                render={<Link href="/restaurant/menu">View Full Menu</Link>}
              />
            </div>
          </div>

          <ReservationWidget />
        </div>
      </div>
    </div>
  );
}
