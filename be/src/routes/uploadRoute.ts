import { generateLesson, generateOutCome } from "controllers/uploadController";
import { Router } from "express";
import { uploadFileService } from "services/disk_storage";

const uploadRouter = Router();

uploadRouter.post(
  "/upload-lesson",
  [uploadFileService.single("file")],
  generateLesson
);

uploadRouter.post(
  "/upload-outcome",
  [uploadFileService.single("file")],
  generateOutCome
);

export default uploadRouter;
