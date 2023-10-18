import { mapToOutCome, OutComeSheetColumns } from "models/OutComeSheet.model";
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
import { Attribute } from "models/Attribute.model";
import AdmZip from "adm-zip";
import { VocabLMSColumns, VocabKeys } from "models/Vocabulary";
import { CEFRSheetColumns, mapToCEFR } from "models/CefrLevel.model";
import { CEFRLevel } from "models/CefrLevel.model";
import { NextApiResponse } from "next";
import { MulterRequest } from "models/MulterRequest.model";
import path from "path";

const parseCSVFile = async ({
  request,
  response,
  folderPath,
  zipFileName,
  handleResult,
}: {
  request: MulterRequest;
  response: NextApiResponse;
  folderPath: string;
  zipFileName: string;
  transformData?: (value: string, field: string | number) => any;
  handleResult: (results: any) => Array<Promise<boolean>>;
}) => {
  try {
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
        console.log("error -->", error);
        return response.status(400).send({ code: 400, message: DEFAULT_ERROR });
      },
      complete: async (results) => {
        const outComePromises = handleResult && handleResult(results.data);
        try {
          outComePromises && (await Promise.all(outComePromises));
          const zip = new AdmZip();
          zip.addLocalFolder(path.resolve(folderPath));

          const data = zip.toBuffer();

          response.setHeader("Content-Type", "application/octet-stream");
          response.setHeader(
            "Content-Disposition",
            `attachment; filename=${zipFileName}`
          );
          response.setHeader("Content-Length", `${data.length}`);
          response.status(200).send(data);
          deleteFolder(folderPath);
          return;
        } catch (error) {
          console.log("----error----");
          console.log(error);
          return response
            .status(400)
            .send({ code: 400, message: DEFAULT_ERROR });
        }
      },
    });
  } catch (error) {
    console.log(error);
    return response.status(500).send({ code: 500, message: DEFAULT_ERROR });
  }
};

const generateLesson = (req: MulterRequest, res: NextApiResponse) => {
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

const generateOutCome = (req: MulterRequest, res: NextApiResponse) => {
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

const generateVocab = (req: MulterRequest, res: NextApiResponse) => {
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

const generateVocabV2 = (req: MulterRequest, res: NextApiResponse) => {
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

const generateCEFR = (req: MulterRequest, res: NextApiResponse) => {
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
  generateCEFR,
  generateVocabToList,
  generateVocabV2,
};
