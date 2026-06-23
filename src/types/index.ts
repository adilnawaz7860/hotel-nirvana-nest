import type { RoomType, TableType, RoomBookingStatus, ReservationStatus, UserRole } from "@/lib/constants";

export type RoomImage = { url: string; publicId: string; alt?: string };

export type Amenity = {
  _id: string;
  name: string;
  icon: string;
  description?: string;
  category: "room" | "hotel" | "restaurant";
};

export type Room = {
  _id: string;
  name: string;
  slug: string;
  roomNumber: string;
  roomType: RoomType;
  description: string;
  capacity: { adults: number; children: number };
  pricePerNight: number;
  discountPercent: number;
  images: RoomImage[];
  amenities: Amenity[];
  size?: number;
  floor?: number;
  isActive: boolean;
  ratingAvg: number;
  ratingCount: number;
  createdAt: string;
};

export type RoomBooking = {
  _id: string;
  bookingCode: string;
  user: string;
  room: Room;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: { adults: number; children: number };
  guestDetails: { name: string; email: string; phone: string };
  ratePerNight: number;
  totalAmount: number;
  status: RoomBookingStatus;
  cancellation?: { reason?: string; cancelledAt?: string; refundAmount?: number };
  createdAt: string;
};

export type RestaurantTable = {
  _id: string;
  tableNumber: string;
  tableType: TableType;
  capacity: number;
  location: "indoor" | "outdoor" | "private";
  isActive: boolean;
};

export type RestaurantReservation = {
  _id: string;
  reservationCode: string;
  user: string;
  table?: RestaurantTable;
  tableType: TableType;
  date: string;
  timeSlot: { start: number; end: number };
  partySize: number;
  guestDetails: { name: string; email: string; phone: string };
  status: ReservationStatus;
  createdAt: string;
};

export type Review = {
  _id: string;
  user: { _id: string; name: string; avatarUrl?: string };
  targetType: "room" | "restaurant" | "general";
  targetId?: string;
  rating: number;
  title?: string;
  comment: string;
  images: { url: string; publicId: string }[];
  isApproved: boolean;
  reply?: { text: string; repliedAt?: string };
  createdAt: string;
};

export type GalleryItem = {
  _id: string;
  title: string;
  category: "rooms" | "restaurant" | "exterior" | "events" | "amenities";
  imageUrl: string;
  publicId: string;
  isFeatured: boolean;
  order: number;
};

export type AuthUser = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  favorites?: string[];
};
