import nc from "next-connect";
import { uploadFile } from "backend/services/disk_storage";
import { generateLesson } from "backend/controllers/uploadController";

const handler = nc();
handler.use(uploadFile);

handler.post(generateLesson);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
