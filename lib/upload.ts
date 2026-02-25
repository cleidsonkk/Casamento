import { v2 as cloudinary } from "cloudinary";
import { env } from "@/lib/env";

const hasDiscreteCloudinaryConfig =
  Boolean(env.CLOUDINARY_CLOUD_NAME) && Boolean(env.CLOUDINARY_API_KEY) && Boolean(env.CLOUDINARY_API_SECRET);

const enabled = Boolean(env.CLOUDINARY_URL) || hasDiscreteCloudinaryConfig;

if (enabled) {
  if (env.CLOUDINARY_URL) {
    cloudinary.config({ cloudinary_url: env.CLOUDINARY_URL });
  } else {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
    });
  }
}

export async function uploadImage(dataUri: string) {
  if (!enabled) return { secure_url: dataUri };
  return cloudinary.uploader.upload(dataUri, { folder: "wedding-saas" });
}
