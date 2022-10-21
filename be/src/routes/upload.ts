import e, { Request, Response, Router } from "express";
import fs from "fs";
import { GoogleSheetData, Level } from "models/GoogleSheet.model";
import { OutCome } from "models/OutCome.model";
import Papaparse from "papaparse";
import { uploadFileService } from "services/disk_storage";
import { Readable } from "stream";
import { createFolder, uploadFolderPath } from "utils/FileUtil";
import { DEFAULT_ERROR, SAVING_SUCCESSFULL } from "utils/MessageUtil";

const uploadRouter = Router();

const GoogleSheetColumns = {
  "Course Plan Lesson ID": "courseLessonId",
  "Outcome ID": "outComeId",
  "Description (EN)": "desEN",
  "Description (VN)": "desVN",
  "Book, unit, and lesson number": "lessonNum",
  "Scores (EN, Separated by new line)": "scoresEN",
  "Scores (VN, Separated by new line)": "scoresVN",
};

const convertToOutCome = (value: GoogleSheetData): OutCome => {
  const allLevel = Object.keys(value.scoresEN || {}).map((key: string) => ({
    [key]: {
      vn: value.scoresVN?.[key] || "",
      en: value.scoresEN?.[key] || "",
    },
  }));

  const data: OutCome = {
    outComeId: value.outComeId,
    info: {
      en: value.desEN,
      vn: value.desVN,
    },
    ...Object.assign({}, ...allLevel),
  };

  return data;
};

const uploadOutCome = (outCome: OutCome) =>
  new Promise<boolean>((resolve, reject) => {
    const uploadFolder = uploadFolderPath();
    const isCreateSuccess = createFolder(uploadFolder);
    if (!isCreateSuccess) return resolve(false);
    if (outCome.outComeId) {
      const courseFolderPath = `${uploadFolder}/${outCome.outComeId}`;
      createFolder(courseFolderPath);
      console.log("upload path = ", courseFolderPath);

      const output: Array<string> = [];
      output.push(
        `[info]\nvn = ${outCome.info?.vn}\nen = ${outCome.info?.en}\n`
      );
      output.push(
        `[lv 1]\nvn = ${outCome.level1?.vn}\nen = ${outCome.level1?.en}\n`
      );
      output.push(
        `[lv 2]\nvn = ${outCome.level2?.vn}\nen = ${outCome.level2?.en}\n`
      );
      output.push(
        `[lv 3]\nvn = ${outCome.level3?.vn}\nen = ${outCome.level3?.en}\n`
      );
      output.push(
        `[lv 4]\nvn = ${outCome.level4?.vn}\nen = ${outCome.level4?.en}\n`
      );
      output.push(
        `[lv 5]\nvn = ${outCome.level5?.vn}\nen = ${outCome.level5?.en}\n`
      );

      fs.writeFile(
        `${courseFolderPath}/info.dat`,
        output.join("\n"),
        (error) => {
          if (error) {
            console.log(`writing error at = ${courseFolderPath}`);
            resolve(false);
            return;
          }
          resolve(true);
        }
      );
    }
  });

uploadRouter.post(
  "/upload_file",
  uploadFileService.single("file"),
  (req: Request, res: Response) => {
    const { file } = req;

    if (!file || file?.mimetype != "text/csv") {
      res.status(501).send({ statusCode: 501, message: DEFAULT_ERROR }).end();
      return;
    }
    const stream = Readable.from(file.buffer);
    Papaparse.parse(stream, {
      transformHeader(header) {
        return GoogleSheetColumns[header as keyof typeof GoogleSheetColumns];
      },
      transform(value, field: string) {
        if (field.toLowerCase().startsWith("scores")) {
          const scores = value.split("\n");

          const res: Level = {};
          for (let i = 0; i < scores.length; i++) {
            res[`level${i + 1}`] = scores[i].trimEnd();
          }
          return res;
        }
        return value;
      },
      header: true,
      worker: true,
      complete: async (results, file) => {
        const mappingData = (results.data as Array<GoogleSheetData>)
          .map(convertToOutCome)
          .map(uploadOutCome);
        try {
          await Promise.all(mappingData);
        } catch (error: unknown) {
          let message = DEFAULT_ERROR;
          res.status(501).send({ statusCode: 501, message }).end();
          return;
        }
        console.log("finish all uploading tasks");
        res.status(200).send({ statusCode: 200, message: SAVING_SUCCESSFULL });
      },
    });
  }
);

export default uploadRouter;
