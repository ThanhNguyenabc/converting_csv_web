import {
  generateLesson,
  generateOutCome,
  generateVocab,
  generateVocabV2,
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

uploadRouter.post(
  "/upload-vocabv2",
  [uploadFileService.single("file")],
  generateVocabV2
);
export default uploadRouter;
