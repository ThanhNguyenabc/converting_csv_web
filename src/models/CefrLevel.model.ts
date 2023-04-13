import { Attribute } from "./Attribute.model";

export const CEFRLevelKeys = {
  levelId: "levelId",
  descEN: "descEN",
  descVN: "descVN",
  metaTag: "metaTag",
};

export const CEFRSheetColumns = {
  "CEFR-level ID": "levelId",
  "Meta tags": CEFRLevelKeys["metaTag"],
  "Description (EN)": "descEN",
  "Description (VN)": "descVN",
};

export interface CEFRLevel {
  levelId: string;
  info: Attribute;
  meta: string;
}

export const mapToCEFR = (params: typeof CEFRLevelKeys): CEFRLevel => {
  return {
    levelId: params.levelId?.toLocaleLowerCase(),
    meta: params.metaTag,
    info: {
      en: params.descEN,
      vn: params.descVN,
    },
  };
};
