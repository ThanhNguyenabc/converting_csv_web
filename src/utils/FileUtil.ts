import fs from "fs";
import path from "path";

const createFolder = (folderPath: string) => {
  if (folderPath.length === 0) return "";
  const formattedPath = path.resolve(folderPath);
  if (!fs.existsSync(formattedPath)) {
    fs.mkdirSync(formattedPath, { recursive: true });
  }
  return formattedPath;
};

const isCSVFile = (file: Express.Multer.File) => {
  if (!file || file?.mimetype != "text/csv") {
    return false;
  }
  return true;
};

const deleteFolder = (folderPath: string) => {
  const formattedPath = path.resolve(folderPath);

  if (fs.existsSync(formattedPath)) {
    fs.rmSync(formattedPath, { recursive: true, force: true });
  }
};

const writeInfoDatFile = async (
  parentFolder: string,
  folderName: string,
  template: string
) => {
  try {
    if (folderName.length == 0) return false;
    const folderPath = createFolder(`${parentFolder}/${folderName}`);
    return await new Promise<boolean>((resolve) => {
      fs.writeFile(`${folderPath}/info.dat`, template, (error) => {
        if (error) {
          return resolve(false);
        }
        return resolve(true);
      });
    }).catch((error) => {
      throw error;
    });
  } catch (error) {
    console.log("writting file error = ", error);
  }
  return false;
};

export { createFolder, isCSVFile, deleteFolder, writeInfoDatFile };
