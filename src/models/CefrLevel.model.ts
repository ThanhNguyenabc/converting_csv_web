import { Attribute } from "./Attribute.model";

export const CEFRLevelKeys = {
  levelId: "levelId",
  descEN: "descEN",
  descVN: "descVN",
  metaTag: "metaTag",
  cefrLevel: "cefrLevel",
};

export const CEFRSheetColumns = {
  "CEFR-level ID": CEFRLevelKeys["levelId"],
  "Meta tags": CEFRLevelKeys["metaTag"],
  "CEFR-level": CEFRLevelKeys["cefrLevel"],
  "Description (EN)": "descEN",
  "Description (VN)": "descVN",
};

export interface CEFRLevel {
  levelId: string;
  info: Attribute;
  meta: string;
  cefrLevel: string;
}

export const mapToCEFR = (params: typeof CEFRLevelKeys): CEFRLevel => {
  return {
    levelId: params.levelId?.toLowerCase(),
    meta: params.metaTag,
    cefrLevel: params.cefrLevel?.toLowerCase(),
    info: {
      en: params.descEN,
      vn: params.descVN,
    },
  };
};
