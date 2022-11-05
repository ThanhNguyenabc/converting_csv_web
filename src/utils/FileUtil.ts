import fs from "fs";

const createFolder = (path: string) => {
  if (path.length === 0) return false;
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }
  return true;
};

const isCSVFile = (file: Express.Multer.File) => {
  if (!file || file?.mimetype != "text/csv") {
    return false;
  }
  return true;
};

export { createFolder, isCSVFile };
