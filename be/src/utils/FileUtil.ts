import fs from "fs";

export const uploadFolderPath = () => {
  let configPath = process.env.UPLOAD_PATH;
  console.log(configPath);
  if (!configPath || configPath.length == 0) configPath = "uploads";
  return `${configPath}`;
};

const createFolder = (path: string) => {
  if (path.length === 0) return false;
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path); 
  }
  return true;
};

export { createFolder };
