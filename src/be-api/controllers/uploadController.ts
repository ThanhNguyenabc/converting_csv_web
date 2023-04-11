import fs from "fs";
import { Request, Response } from "express";
import {
  mapToOutCome,
  OutCome,
  OutComeKeys,
  OutComeSheetColumns,
} from "models/OutComeSheet.model";
import { Readable } from "stream";
import Papaparse from "papaparse";
import { deleteFolder, isCSVFile, writeInfoDatFile } from "utils/FileUtil";
import { DEFAULT_ERROR } from "utils/MessageUtil";
import {
  lessonTemplate,
  outComeTemplate,
  vocabV2Template,
  vocabTemplate,
  cefrLevelTemplate,
} from "./output-template";
import {
  generateVocabToList,
  Lesson,
  LessonColumn,
  MappingLessonColum,
  mappToLesson as mapToLesson,
} from "models/LessonSheet.model";
import { UPLOAD_PATH } from "utils/StringUtil";
import { BaseResponse } from "models/Response";
import { Attribute } from "models/Attribute.model";
import AdmZip from "adm-zip";
import { VocabLMSColumns, VocabKeys } from "models/Vocabulary";
import { CEFRSheetColumns, mapToCEFR } from "models/CefrLevel.model";
import { CEFRLevel } from "models/CefrLevel.model";

const parseCSVFile = async ({
  request,
  response,
  folderPath,
  zipFileName,
  handleResult,
}: {
  request: Request;
  response: Response;
  folderPath: string;
  zipFileName: string;
  transformData?: (value: string, field: string | number) => any;
  handleResult?: (results: any) => Array<Promise<boolean>>;
}) => {
  const { file } = request;
  if (!file || !isCSVFile(file)) {
    return response
      .status(404)
      .send({ code: 404, message: "No found csv file" });
  }
  const streamFile = Readable.from(file.buffer);

  Papaparse.parse(streamFile, {
    worker: true,
    error: (error) => {
      console.log("error");
      console.log(error);
      return response.status(400).send({ code: 400, message: DEFAULT_ERROR });
    },
    complete: async (results) => {
      deleteFolder(folderPath);
      const outComePromises = handleResult && handleResult(results.data);
      try {
        outComePromises && (await Promise.all(outComePromises));
        const zip = new AdmZip();
        zip.addLocalFolder(folderPath);
        const data = zip.toBuffer();
        zip.writeZip(zipFileName);

        response.set("Content-Type", "application/octet-stream");
        response.set(
          "Content-Disposition",
          `attachment; filename=${zipFileName}`
        );
        response.set("Content-Length", `${data.length}`);
        return response.status(200).send(data);
      } catch (error) {
        console.log(error);
        return response.status(400).send({ code: 400, message: DEFAULT_ERROR });
      }
    },
  });
};

const generateLesson = (req: Request, res: Response<BaseResponse>) => {
  const pathFile = `${UPLOAD_PATH}uploads/lessons`;

  parseCSVFile({
    request: req,
    response: res,
    folderPath: pathFile,
    zipFileName: "lesson.zip",
    handleResult: (results) => {
      const headers = results[0];
      const lessons: Array<Lesson> = [];
      for (let index = 1; index < results.length; index++) {
        const item: Array<string> = results[index];
        const data = item.reduce((result, item, index, array) => {
          const key =
            MappingLessonColum[
              headers[index] as keyof typeof MappingLessonColum
            ] || "";

          result[key] = item;
          return result;
        }, {} as any);
        lessons.push(mapToLesson(data));
      }
      return lessons.map((item) =>
        writeInfoDatFile(pathFile, item.lessonId, lessonTemplate(item))
      );
    },
  });
};

const generateOutCome = (req: Request, res: Response<BaseResponse>) => {
  const pathFile = `${UPLOAD_PATH}uploads/outcomes`;
  parseCSVFile({
    request: req,
    response: res,
    folderPath: pathFile,
    zipFileName: "outcome.zip",
    handleResult: (results) => {
      const headers = results[0];
      const outComes = [];
      for (let index = 1; index < results.length; index++) {
        const item: Array<string> = results[index];
        const data = item.reduce((result, item, index, array) => {
          const key =
            OutComeSheetColumns[
              headers[index] as keyof typeof OutComeSheetColumns
            ] || "";

          result[key] = item;
          return result;
        }, {} as any);
        outComes.push(mapToOutCome(data));
      }
      return outComes.map((item) =>
        writeInfoDatFile(pathFile, item.outComeId, outComeTemplate(item))
      );
    },
  });
};

const generateVocab = (req: Request, res: Response<BaseResponse>) => {
  const pathFile = `${UPLOAD_PATH}uploads/vocab`;

  const vocabs: Array<string> = [];
  parseCSVFile({
    request: req,
    response: res,
    folderPath: pathFile,
    zipFileName: "vocab.zip",

    handleResult: () => {
      return vocabs.map((item) => {
        const vocabItem: Attribute = { en: item, vn: "" };
        return writeInfoDatFile(pathFile, item || "", vocabTemplate(vocabItem));
      });
    },
  });
};

const generateVocabV2 = (req: Request, res: Response<BaseResponse>) => {
  const pathFile = `${UPLOAD_PATH}uploads/vocabV2`;

  parseCSVFile({
    request: req,
    response: res,
    folderPath: pathFile,
    zipFileName: "vocabV2.zip",
    handleResult: (results) => {
      const headers = results[0];
      const vocabList: Array<typeof VocabKeys> = [];
      for (let index = 1; index < results.length; index++) {
        const item: Array<string> = results[index];
        const data = item.reduce((result, item, index, array) => {
          const key =
            VocabLMSColumns[headers[index] as keyof typeof VocabLMSColumns] ||
            "";

          result[key] = item;
          return result;
        }, {} as any);
        vocabList.push(data);
      }
      return vocabList.map((item) =>
        writeInfoDatFile(pathFile, item.vocabTerm, vocabV2Template(item))
      );
    },
  });
};

const generateCEFR = (req: Request, res: Response<BaseResponse>) => {
  const pathFile = `${UPLOAD_PATH}uploads/cefr`;

  parseCSVFile({
    request: req,
    response: res,
    folderPath: pathFile,
    zipFileName: "cefr.zip",
    handleResult: (results: Array<any>) => {
      const headers = results[0];
      const cefrList: Array<CEFRLevel> = [];
      for (let index = 1; index < results.length; index++) {
        const item: Array<string> = results[index];
        const data = item.reduce((result, item, index, array) => {
          const key =
            CEFRSheetColumns[headers[index] as keyof typeof CEFRSheetColumns] ||
            "";

          result[key] = item;
          return result;
        }, {} as any);
        cefrList.push(mapToCEFR(data));
      }
      return cefrList.map((item) =>
        writeInfoDatFile(pathFile, item.levelId, cefrLevelTemplate(item))
      );
    },
  });
};

export {
  generateLesson,
  generateOutCome,
  generateVocab,
  generateVocabV2,
  generateCEFR,
};
