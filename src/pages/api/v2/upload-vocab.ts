import nc from "next-connect";
import { uploadFile } from "backend/services/disk_storage";
import { generateVocabV2 } from "backend/controllers/uploadController";

const handler = nc();
handler.use(uploadFile);
handler.post(generateVocabV2);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
