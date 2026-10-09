import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "iiuruorj",
  api_key: process.env.CLOUDINARY_API_KEY || "677127419392758",
  api_secret: process.env.CLOUDINARY_API_SECRET || "pmikfbRJZsH3nP7z8KV4P5qI71M",
  secure: true,
});

export default cloudinary;

export async function uploadImageToCloudinary(
  fileBuffer: Buffer | string,
  folder: string = "jewelry_marketplace"
): Promise<{ secure_url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    if (typeof fileBuffer === "string" && fileBuffer.startsWith("http")) {
      cloudinary.uploader.upload(
        fileBuffer,
        { folder },
        (error, result) => {
          if (error || !result) return reject(error || new Error("Upload failed"));
          resolve({ secure_url: result.secure_url, public_id: result.public_id });
        }
      );
    } else {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error || !result) return reject(error || new Error("Upload failed"));
          resolve({ secure_url: result.secure_url, public_id: result.public_id });
        }
      );

      if (Buffer.isBuffer(fileBuffer)) {
        uploadStream.end(fileBuffer);
      } else {
        const base64Data = fileBuffer.replace(/^data:image\/\w+;base64,/, "");
        uploadStream.end(Buffer.from(base64Data, "base64"));
      }
    }
  });
}
