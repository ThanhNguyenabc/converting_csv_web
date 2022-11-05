import {
  generateLesson,
  generateOutCome,
  generateVocab,
} from "be-api/controllers/uploadController";
import { uploadFileService } from "be-api/services/disk_storage";
import { Router } from "express";

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

uploadRouter.post(
  "/upload-vocab",
  [uploadFileService.single("file")],
  generateVocab
);

export default uploadRouter;
