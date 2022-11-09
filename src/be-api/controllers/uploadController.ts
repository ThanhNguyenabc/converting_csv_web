import { Request, Response } from "express";
import * as OutComeSheetModel from "models/OutComeSheet.model";
import { Readable } from "stream";
import Papaparse from "papaparse";
import fs from "fs";
import { createFolder, deleteFolder, isCSVFile } from "utils/FileUtil";
import { DEFAULT_ERROR, SAVING_SUCCESSFULL } from "utils/MessageUtil";
import {
  lessonTemplate,
  outComeTemplate,
  vocabTemplate,
} from "./output-template";
import {
  generateVocabToList,
  LessonColumn,
  MappingLessonColum,
  mappToLesson as mapToLesson,
} from "models/LessonSheet.model";
import {
  LESSON_PATH,
  LESSON_ZIP,
  OUTCOME_PATH,
  OUTCOME_ZIP,
  VOCAB_PATH,
  VOCAB_ZIP,
} from "utils/StringUtil";
import { BaseResponse } from "models/Response";
import { Attribute } from "models/Attribute.model";
import AdmZip from "adm-zip";

const writeDataToDisk = (
  parentFolder: string,
  folderName: string,
  template: string
) =>
  new Promise<boolean>((resolve) => {
    const path = `${parentFolder}/${folderName}`;
    createFolder(path);
    fs.writeFile(`${path}/info.dat`, template, (error) => {
      if (error) {
        console.log(`writing error at = ${path}`);
        resolve(false);
        return;
      }
      resolve(true);
    });
  }).catch((error) => {
    throw error;
  });

const parseCSVFile = ({
  request,
  response,
  uploadPath,
  zipFileName,
  transformData,
  transformHeader,
  handleResult,
}: {
  request: Request;
  response: Response;
  uploadPath: string;
  zipFileName: string;
  transformData?: (value: string, field: string | number) => any;
  handleResult?: (results: any) => Array<Promise<boolean>>;
  transformHeader?: (value: string) => string;
}) => {
  const { file } = request;
  if (!file || !isCSVFile(file)) {
    return response
      .status(404)
      .send({ code: 404, message: "No found csv file" });
  }
  const streamFile = Readable.from(file.buffer);
  Papaparse.parse(streamFile, {
    transformHeader: transformHeader,
    transform: transformData,
    header: true,
    worker: true,
    error: () => {
      response.status(400).send({ code: 400, message: DEFAULT_ERROR });
    },
    complete: async (results) => {
      const outComePromises = handleResult && handleResult(results.data);
      try {
        outComePromises && (await Promise.all(outComePromises));
        const zip = new AdmZip();
        zip.addLocalFolder(uploadPath);
        const data = zip.toBuffer();
        zip.writeZip(zipFileName);

        response.set("Content-Type", "application/octet-stream");
        response.set(
          "Content-Disposition",
          `attachment; filename=${zipFileName}`
        );
        response.set("Content-Length", `${data.length}`);
        response.status(200).send(data);
      } catch (error) {
        response.status(400).send({ code: 400, message: DEFAULT_ERROR });
      }
    },
  });
};

const generateLesson = (req: Request, res: Response<BaseResponse>) => {
  parseCSVFile({
    request: req,
    response: res,
    uploadPath: LESSON_PATH,
    zipFileName: LESSON_ZIP,
    transformHeader(header) {
      const newHeader =
        MappingLessonColum[header as keyof typeof MappingLessonColum];
      return newHeader || header;
    },
    handleResult: (results) => {
      deleteFolder(LESSON_PATH)

      return (results as Array<typeof LessonColumn>)
        .map(mapToLesson)
        .map((item) =>
          writeDataToDisk(LESSON_PATH, item.lessonId, lessonTemplate(item))
        );
    },
  });
};

const generateOutCome = (req: Request, res: Response<BaseResponse>) => {
  parseCSVFile({
    request: req,
    response: res,
    uploadPath: OUTCOME_PATH,
    zipFileName: OUTCOME_ZIP,
    transformHeader(header) {
      const newHeader =
        OutComeSheetModel.MappingOutComeColum[
          header as keyof typeof OutComeSheetModel.MappingOutComeColum
        ];
      return newHeader || header;
    },
    handleResult: (results) => {
      deleteFolder(OUTCOME_PATH)

      return (results as Array<typeof OutComeSheetModel.OutComeColumn>)
        .map(OutComeSheetModel.mapToOutCome)
        .map((item) =>
          writeDataToDisk(OUTCOME_PATH, item.outComeId, outComeTemplate(item))
        );
    },
  });
};

const generateVocab = (req: Request, res: Response<BaseResponse>) => {
  const vocabs: Array<string> = [];
  parseCSVFile({
    request: req,
    response: res,
    uploadPath: VOCAB_PATH,
    zipFileName: VOCAB_ZIP,
    transformHeader(header) {
      const newHeader =
        MappingLessonColum[header as keyof typeof MappingLessonColum];
      return newHeader || header;
    },
    transformData(value, field) {
      if (field === LessonColumn["vocabulary"] && value?.trim().length > 0) {
        const res = generateVocabToList(value || "");
        res.length > 0 && vocabs.push(...res);
      }
    },
    handleResult: () => {
      deleteFolder(VOCAB_PATH)
      return vocabs.map((item) => {
        const vocabItem: Attribute = { en: item, vn: "" };
        return writeDataToDisk(
          VOCAB_PATH,
          item || "",
          vocabTemplate(vocabItem)
        );
      });
    },
  });
};
export { generateLesson, generateOutCome, generateVocab };
