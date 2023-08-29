import nc from "next-connect";
import { uploadFile } from "backend/services/disk_storage";
import { generateCEFR } from "backend/controllers/uploadController";
const handler = nc();
handler.use(uploadFile);

handler.post(generateCEFR);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
