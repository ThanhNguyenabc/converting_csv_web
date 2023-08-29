import multer from "multer";

const uploadFileService = multer({});
const uploadFile = uploadFileService.single("file");
export { uploadFileService, uploadFile };
