import { connectMongo } from "@/lib/db/connect";
import { Gallery } from "@/models/Gallery";
import { destroyCloudinaryAsset } from "@/lib/storage/cloudinary";
import { NotFoundError } from "@/lib/utils/api-response";
import type { GalleryItemInput } from "@/lib/validations/cms.validation";

export const GalleryService = {
  async create(input: GalleryItemInput) {
    await connectMongo();
    return Gallery.create(input);
  },

  async update(id: string, input: Partial<GalleryItemInput>) {
    await connectMongo();
    const item = await Gallery.findByIdAndUpdate(id, input, { returnDocument: "after" });
    if (!item) throw new NotFoundError("Gallery item not found");
    return item;
  },

  async remove(id: string) {
    await connectMongo();
    const item = await Gallery.findById(id);
    if (!item) throw new NotFoundError("Gallery item not found");
    await destroyCloudinaryAsset(item.publicId).catch(() => null);
    await item.deleteOne();
    return item;
  },

  async list(category?: string) {
    await connectMongo();
    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;
    return Gallery.find(filter).sort({ order: 1, createdAt: -1 });
  },

  async featured(limit = 8) {
    await connectMongo();
    return Gallery.find({ isFeatured: true }).sort({ order: 1 }).limit(limit);
  },
};
