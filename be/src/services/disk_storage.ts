import multer, { memoryStorage } from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
});

const uploadFileService = multer({});

export { uploadFileService };
