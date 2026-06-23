import { connectMongo } from "@/lib/db/connect";
import { Room } from "@/models/Room";
import { slugify } from "@/lib/utils/codes";
import { ConflictError, NotFoundError } from "@/lib/utils/api-response";
import type { CreateRoomInput, UpdateRoomInput } from "@/lib/validations/room.validation";

export const RoomService = {
  async create(input: CreateRoomInput) {
    await connectMongo();

    const existing = await Room.findOne({ roomNumber: input.roomNumber });
    if (existing) throw new ConflictError("ROOM_NUMBER_EXISTS", "A room with this number already exists");

    let slug = slugify(input.name);
    let suffix = 0;
    while (await Room.findOne({ slug: suffix ? `${slug}-${suffix}` : slug })) {
      suffix += 1;
    }
    if (suffix) slug = `${slug}-${suffix}`;

    return Room.create({ ...input, slug });
  },

  async update(id: string, input: UpdateRoomInput) {
    await connectMongo();
    const room = await Room.findById(id);
    if (!room) throw new NotFoundError("Room not found");

    Object.assign(room, input);
    await room.save();
    return room;
  },

  async softDelete(id: string) {
    await connectMongo();
    const room = await Room.findByIdAndUpdate(id, { isActive: false }, { returnDocument: "after" });
    if (!room) throw new NotFoundError("Room not found");
    return room;
  },

  async getBySlug(slug: string) {
    await connectMongo();
    const room = await Room.findOne({ slug }).populate("amenities");
    if (!room) throw new NotFoundError("Room not found");
    return room;
  },

  async getById(id: string) {
    await connectMongo();
    const room = await Room.findById(id).populate("amenities");
    if (!room) throw new NotFoundError("Room not found");
    return room;
  },

  async list(params: { roomType?: string; isActive?: boolean; page?: number; limit?: number }) {
    await connectMongo();
    const { roomType, isActive, page = 1, limit = 12 } = params;
    const filter: Record<string, unknown> = {};
    if (roomType) filter.roomType = roomType;
    if (isActive !== undefined) filter.isActive = isActive;

    const [rooms, total] = await Promise.all([
      Room.find(filter)
        .populate("amenities")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Room.countDocuments(filter),
    ]);
    return { rooms, total };
  },

  async featured(limit = 6) {
    await connectMongo();
    return Room.find({ isActive: true }).sort({ ratingAvg: -1, createdAt: -1 }).limit(limit);
  },
};
