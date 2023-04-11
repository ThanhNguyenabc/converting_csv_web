import {
  generateCEFR,
  generateLesson,
  generateOutCome,
  generateVocab,
  generateVocabV2,
} from "be-api/controllers/uploadController";
import { uploadFileService } from "be-api/services/disk_storage";
import { Router } from "express";

const uploadRouter = Router();

uploadRouter.post(
  "/v1/upload-lesson",
  [uploadFileService.single("file")],
  generateLesson
);

uploadRouter.post(
  "/v1/upload-outcome",
  [uploadFileService.single("file")],
  generateOutCome
);

uploadRouter.post(
  "/v1/upload-vocab",
  [uploadFileService.single("file")],
  generateVocab
);

uploadRouter.post(
  "/v2/upload-vocab",
  [uploadFileService.single("file")],
  generateVocabV2
);

uploadRouter.post(
  "/v1/upload-cefr",
  [uploadFileService.single("file")],
  generateCEFR
);

export default uploadRouter;
