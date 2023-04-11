import { Attribute } from "./Attribute.model";

export const CEFRLevelKeys = {
  levelId: "levelId",
  descEN: "descEN",
  descVN: "descVN",
};

export const CEFRSheetColumns = {
  "CEFR-level ID": "levelId",
  "Description (EN)": "descEN",
  "Description (VN)": "descVN",
};

export interface CEFRLevel {
  levelId: string;
  info: Attribute;
}

export const mapToCEFR = (params: typeof CEFRLevelKeys): CEFRLevel => {
  return {
    levelId: params.levelId?.toLocaleLowerCase(),
    info: {
      en: params.descEN,
      vn: params.descVN,
    },
  };
};
