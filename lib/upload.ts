import { v2 as cloudinary } from "cloudinary";

const enabled =
  Boolean(process.env.CLOUDINARY_CLOUD_NAME) &&
  Boolean(process.env.CLOUDINARY_API_KEY) &&
  Boolean(process.env.CLOUDINARY_API_SECRET);

if (enabled) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function uploadImage(dataUri: string) {
  if (!enabled) return { secure_url: dataUri };
  return cloudinary.uploader.upload(dataUri, { folder: "wedding-saas" });
}

