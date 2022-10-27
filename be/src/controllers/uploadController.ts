import { Request, Response } from "express";
import {
  MappingOutComeColum,
  mapToOutCome,
  OutComeColumn,
} from "models/OutComeSheet.model";
import { BaseResponse } from "models/Response";
import { Readable } from "stream";
import Papaparse from "papaparse";
import fs from "fs";
import { createFolder, isCSVFile } from "utils/FileUtil";
import { DEFAULT_ERROR, SAVING_SUCCESSFULL } from "utils/MessageUtil";
import { lessonTemplate, outComeTemplate } from "./template";
import {
  LessonColumn,
  MappingLessonColum,
  mappToLesson,
} from "models/LessonSheet.model";
import { LESSON_PATH, OUTCOME_PATH } from "utils/StringUtil";

const writeDataToDisk = (
  parentFolder: string,
  folderName: string,
  template: string
) =>
  new Promise<boolean>((resolve) => {
    const courseFolderPath = `${parentFolder}/${folderName}`;
    createFolder(courseFolderPath);
    fs.writeFile(`${courseFolderPath}/info.dat`, template, (error) => {
      if (error) {
        console.log(`writing error at = ${courseFolderPath}`);
        resolve(false);
        return;
      }
      resolve(true);
    });
  }).catch((error) => {
    throw error;
  });

const parseCSVFile = ({
  request: req,
  response,
  transformData,
  transformHeader,
  handleResult,
}: {
  request: Request;
  response: Response<BaseResponse>;
  transformData?: (value: string, field: string | number) => any;
  handleResult?: (results: any) => Array<Promise<boolean>>;
  transformHeader?: (value: string) => string;
}) => {
  const { file } = req;
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
        response.status(200).send({ message: SAVING_SUCCESSFULL, code: 200 });
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
    transformHeader(header) {
      const newHeader =
        MappingLessonColum[header as keyof typeof MappingLessonColum];
      return newHeader || header;
    },
    handleResult: (results) => {
      return (results as Array<typeof LessonColumn>)
        .map(mappToLesson)
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
    transformHeader(header) {
      const newHeader =
        MappingOutComeColum[header as keyof typeof MappingOutComeColum];
      return newHeader || header;
    },
    handleResult: (results) => {
      return (results as Array<typeof OutComeColumn>)
        .map(mapToOutCome)
        .map((item) =>
          writeDataToDisk(OUTCOME_PATH, item.outComeId, outComeTemplate(item))
        );
    },
  });
};

export { generateLesson, generateOutCome };
