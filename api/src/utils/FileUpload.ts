import { Readable } from "stream";
import cloudinary from "../config/cloudinary";

interface UploadImageParams {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

export const getImageURL = async ({
  buffer,
  originalname,
  mimetype,
}: UploadImageParams): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "studyhere/bugreport",
        resource_type: "auto",
        public_id: originalname.split(".")[0],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result?.secure_url || "");
        }
      }
    );

    const stream = Readable.from(buffer);
    stream.pipe(uploadStream);
  });
};
