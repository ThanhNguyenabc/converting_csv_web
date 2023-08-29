import nc from "next-connect";
import { uploadFile } from "backend/services/disk_storage";
import { generateOutCome } from "backend/controllers/uploadController";

const handler = nc();
handler.use(uploadFile);
handler.post(generateOutCome);

export const config = {
  api: {
    bodyParser: false,
  },
};
export default handler;
