import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { connectMongo } from "@/lib/db/connect";
import { User } from "@/models/User";
import { Room } from "@/models/Room";
import { RestaurantTable } from "@/models/RestaurantTable";
import { Amenity } from "@/models/Amenity";
import { WebsiteSettings } from "@/models/WebsiteSettings";
import { hashPassword } from "@/lib/auth/password";
import { slugify } from "@/lib/utils/codes";

async function seed() {
  await connectMongo();
  console.log("Connected to MongoDB. Seeding...");

  const adminPassword = await hashPassword("Admin@12345");
  await User.findOneAndUpdate(
    { email: "admin@hotelnirvananest.com" },
    {
      name: "Nirvana Nest Admin",
      email: "admin@hotelnirvananest.com",
      phone: "9810000001",
      passwordHash: adminPassword,
      role: "admin",
    },
    { upsert: true }
  );
  console.log("Admin user ready: admin@hotelnirvananest.com / Admin@12345");

  const amenityDefs = [
    { name: "Free Wi-Fi", icon: "wifi", category: "hotel" as const },
    { name: "Swimming Pool", icon: "waves", category: "hotel" as const },
    { name: "Fitness Centre", icon: "dumbbell", category: "hotel" as const },
    { name: "Complimentary Parking", icon: "parking-circle", category: "hotel" as const },
    { name: "Air Conditioning", icon: "wind", category: "room" as const },
    { name: "Smart TV", icon: "tv", category: "room" as const },
    { name: "Mini Fridge", icon: "refrigerator", category: "room" as const },
    { name: "Tea/Coffee Maker", icon: "coffee", category: "room" as const },
    { name: "Multi-Cuisine Menu", icon: "utensils-crossed", category: "restaurant" as const },
    { name: "Private Dining", icon: "users", category: "restaurant" as const },
  ];

  const amenities = await Promise.all(
    amenityDefs.map((def) =>
      Amenity.findOneAndUpdate({ name: def.name }, def, { upsert: true, returnDocument: "after" })
    )
  );
  console.log(`Seeded ${amenities.length} amenities`);

  const roomAmenityIds = amenities.filter((a) => a.category === "room").map((a) => a._id);

  const roomDefs = [
    {
      name: "Nirvana Deluxe Room",
      roomNumber: "101",
      roomType: "deluxe" as const,
      description:
        "A cozy and elegantly furnished room offering modern comfort, perfect for solo travellers and couples seeking a relaxing stay in Gomti Nagar.",
      capacity: { adults: 2, children: 1 },
      pricePerNight: 4500,
      discountPercent: 10,
      size: 220,
      floor: 1,
    },
    {
      name: "Nirvana Executive Room",
      roomNumber: "201",
      roomType: "executive" as const,
      description:
        "Spacious and thoughtfully designed for business travellers, featuring a dedicated work desk and premium amenities.",
      capacity: { adults: 2, children: 2 },
      pricePerNight: 6200,
      discountPercent: 0,
      size: 280,
      floor: 2,
    },
    {
      name: "Nirvana Family Room",
      roomNumber: "301",
      roomType: "family" as const,
      description:
        "A generously sized room designed for families, with twin beds and extra space for a comfortable group stay.",
      capacity: { adults: 4, children: 2 },
      pricePerNight: 7800,
      discountPercent: 5,
      size: 380,
      floor: 3,
    },
    {
      name: "Nirvana Premium Suite",
      roomNumber: "401",
      roomType: "premium_suite" as const,
      description:
        "Our most luxurious accommodation featuring a separate living area, premium furnishings and uninterrupted views of Gomti Nagar.",
      capacity: { adults: 3, children: 2 },
      pricePerNight: 11500,
      discountPercent: 0,
      size: 520,
      floor: 4,
    },
  ];

  for (const def of roomDefs) {
    await Room.findOneAndUpdate(
      { roomNumber: def.roomNumber },
      { ...def, slug: slugify(def.name), amenities: roomAmenityIds, isActive: true },
      { upsert: true }
    );
  }
  console.log(`Seeded ${roomDefs.length} rooms`);

  const tableDefs = [
    { tableNumber: "T1", tableType: "2_seater" as const, capacity: 2, location: "indoor" as const },
    { tableNumber: "T2", tableType: "2_seater" as const, capacity: 2, location: "indoor" as const },
    { tableNumber: "T3", tableType: "4_seater" as const, capacity: 4, location: "indoor" as const },
    { tableNumber: "T4", tableType: "4_seater" as const, capacity: 4, location: "outdoor" as const },
    { tableNumber: "T5", tableType: "6_seater" as const, capacity: 6, location: "indoor" as const },
    { tableNumber: "T6", tableType: "family_table" as const, capacity: 10, location: "private" as const },
  ];

  for (const def of tableDefs) {
    await RestaurantTable.findOneAndUpdate({ tableNumber: def.tableNumber }, def, { upsert: true });
  }
  console.log(`Seeded ${tableDefs.length} restaurant tables`);

  await WebsiteSettings.findOneAndUpdate({}, {}, { upsert: true });
  console.log("Website settings initialized");

  console.log("\nSeed complete.");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
