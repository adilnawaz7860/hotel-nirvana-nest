import { type NextRequest } from "next/server";
import { connectMongo } from "@/lib/db/connect";
import { getAvailableSlotsForDay } from "@/modules/restaurant/reservation.algorithm";
import { reservationAvailabilityQuerySchema } from "@/lib/validations/reservation.validation";
import { generateTimeSlots, timeStringToMinutes } from "@/lib/utils/dates";
import { HOTEL_INFO, SEATING_DURATION_MIN } from "@/lib/constants";
import { ok, fail } from "@/lib/utils/api-response";

export async function GET(request: NextRequest) {
  try {
    await connectMongo();
    const searchParams = request.nextUrl.searchParams;
    const query = reservationAvailabilityQuerySchema.parse({
      date: searchParams.get("date"),
      partySize: searchParams.get("partySize") ?? undefined,
    });

    const slotTimes = generateTimeSlots(
      HOTEL_INFO.restaurantOpenTime,
      HOTEL_INFO.restaurantCloseTime,
      30
    ).filter((t) => timeStringToMinutes(t) + SEATING_DURATION_MIN <= timeStringToMinutes(HOTEL_INFO.restaurantCloseTime));

    const slots = await getAvailableSlotsForDay({
      date: query.date,
      partySize: query.partySize,
      slots: slotTimes.map(timeStringToMinutes),
    });

    const result = slots.map((s, i) => ({ time: slotTimes[i], available: s.available }));
    return ok(result);
  } catch (error) {
    return fail(error);
  }
}
