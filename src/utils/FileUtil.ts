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

const deleteFolder = (path: string) => {
  if (fs.existsSync(path)) {
    fs.rmSync(path, { recursive: true, force: true });
  }
};

const writeInfoDatFile = async (
  parentFolder: string,
  folderName: string,
  template: string
) => {
  try {
    if (folderName.length == 0) return false;
    const path = `${parentFolder}/${folderName}`;
    createFolder(path);
    return await new Promise<boolean>((resolve) => {
      fs.writeFile(`${path}/info.dat`, template, (error) => {
        if (error) {
          return resolve(false);
        }
        return resolve(true);
      });
    }).catch((error) => {
      throw error;
    });
  } catch (error) {
    return false;
  }
};

export { createFolder, isCSVFile, deleteFolder, writeInfoDatFile };
