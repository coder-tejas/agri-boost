import { configDotenv } from "dotenv";
import ImageKit from "imagekit";
configDotenv();
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: "https://ik.imagekit.io/badassCodes",
});

export async function uploadToImagekit(buffer: Buffer, fileName: string) {
  const res = await imagekit.upload({
    file: buffer.toString("base64"),
    fileName,
  });
  return res;
}
export async function deleteFromImagekit(fileId: string) {
  const res = await imagekit.deleteFile(fileId);
  return res;
}
