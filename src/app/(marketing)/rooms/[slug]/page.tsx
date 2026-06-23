import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RoomService } from "@/modules/rooms/room.service";
import { RoomDetailContent } from "./room-detail-content";
import { NotFoundError } from "@/lib/utils/api-response";

type Params = { params: Promise<{ slug: string }> };

async function getRoom(slug: string) {
  try {
    const room = await RoomService.getBySlug(slug);
    return JSON.parse(JSON.stringify(room));
  } catch (error) {
    if (error instanceof NotFoundError) return null;
    throw error;
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const room = await getRoom(slug);
  if (!room) return {};

  return {
    title: `${room.name} | Hotel Nirvana Nest`,
    description: room.description.slice(0, 160),
    openGraph: {
      title: room.name,
      description: room.description.slice(0, 160),
      images: room.images?.[0]?.url ? [room.images[0].url] : undefined,
    },
  };
}

export default async function RoomDetailPage({ params }: Params) {
  const { slug } = await params;
  const room = await getRoom(slug);
  if (!room) notFound();

  return <RoomDetailContent room={room} />;
}
