import type { MetadataRoute } from "next";
import { connectMongo } from "@/lib/db/connect";
import { Room } from "@/models/Room";

const STATIC_ROUTES = [
  "",
  "/rooms",
  "/restaurant",
  "/restaurant/menu",
  "/gallery",
  "/about",
  "/contact",
  "/reviews",
  "/faq",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  let roomEntries: MetadataRoute.Sitemap = [];
  try {
    await connectMongo();
    const rooms = await Room.find({ isActive: true }).select("slug updatedAt").lean();
    roomEntries = rooms.map((room) => ({
      url: `${baseUrl}/rooms/${room.slug}`,
      lastModified: room.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch {
    roomEntries = [];
  }

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));

  return [...staticEntries, ...roomEntries];
}
