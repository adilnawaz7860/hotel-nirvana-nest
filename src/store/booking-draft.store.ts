import { create } from "zustand";

type BookingDraftState = {
  checkIn?: string;
  checkOut?: string;
  adults: number;
  children: number;
  setDates: (checkIn?: string, checkOut?: string) => void;
  setGuests: (adults: number, children: number) => void;
};

export const useBookingDraftStore = create<BookingDraftState>((set) => ({
  adults: 2,
  children: 0,
  setDates: (checkIn, checkOut) => set({ checkIn, checkOut }),
  setGuests: (adults, children) => set({ adults, children }),
}));
