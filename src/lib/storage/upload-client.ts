import { apiFetch } from "@/lib/api-client";

type CloudinarySignature = {
  timestamp: number;
  signature: string;
  folder: string;
  apiKey: string;
  cloudName: string;
};

export async function uploadToCloudinary(file: File, folder: string) {
  const { data: sig } = await apiFetch<CloudinarySignature>(
    `/api/uploads/cloudinary-sign?folder=${encodeURIComponent(folder)}`
  );

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", sig.apiKey);
  formData.append("timestamp", String(sig.timestamp));
  formData.append("signature", sig.signature);
  formData.append("folder", sig.folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Image upload failed");

  const json = await res.json();
  return { url: json.secure_url as string, publicId: json.public_id as string };
}
