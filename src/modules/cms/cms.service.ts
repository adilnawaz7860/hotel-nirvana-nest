import { connectMongo } from "@/lib/db/connect";
import { WebsiteSettings } from "@/models/WebsiteSettings";
import { Amenity } from "@/models/Amenity";
import { ContactQuery } from "@/models/ContactQuery";
import { NotFoundError } from "@/lib/utils/api-response";
import type { WebsiteSettingsInput, AmenityInput } from "@/lib/validations/cms.validation";
import type { ContactQueryInput } from "@/lib/validations/contact.validation";

export const CmsService = {
  async getSettings() {
    await connectMongo();
    let settings = await WebsiteSettings.findOne();
    if (!settings) settings = await WebsiteSettings.create({});
    return settings;
  },

  async updateSettings(input: WebsiteSettingsInput) {
    await connectMongo();
    let settings = await WebsiteSettings.findOne();
    if (!settings) settings = new WebsiteSettings();
    Object.assign(settings, input);
    await settings.save();
    return settings;
  },

  async listAmenities(category?: string) {
    await connectMongo();
    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;
    return Amenity.find(filter).sort({ name: 1 });
  },

  async createAmenity(input: AmenityInput) {
    await connectMongo();
    return Amenity.create(input);
  },

  async updateAmenity(id: string, input: Partial<AmenityInput>) {
    await connectMongo();
    const amenity = await Amenity.findByIdAndUpdate(id, input, { returnDocument: "after" });
    if (!amenity) throw new NotFoundError("Amenity not found");
    return amenity;
  },

  async deleteAmenity(id: string) {
    await connectMongo();
    const amenity = await Amenity.findByIdAndDelete(id);
    if (!amenity) throw new NotFoundError("Amenity not found");
    return amenity;
  },

  async submitContactQuery(input: ContactQueryInput) {
    await connectMongo();
    return ContactQuery.create(input);
  },

  async listContactQueries(params: { status?: string; page?: number; limit?: number }) {
    await connectMongo();
    const { status, page = 1, limit = 20 } = params;
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;

    const [queries, total] = await Promise.all([
      ContactQuery.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      ContactQuery.countDocuments(filter),
    ]);
    return { queries, total };
  },

  async updateContactQueryStatus(id: string, status: "new" | "in_progress" | "resolved") {
    await connectMongo();
    const query = await ContactQuery.findByIdAndUpdate(id, { status }, { returnDocument: "after" });
    if (!query) throw new NotFoundError("Query not found");
    return query;
  },
};
