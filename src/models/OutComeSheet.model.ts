import { REMOVE_LINE_BREAKS_REGEX } from "utils/StringUtil";
import { Attribute } from "./Attribute.model";
import { Cefr } from "./Cefr.model";

export const OutComeKeys = {
  outComeId: "outComeId",
  desEN: "desEN",
  desVN: "desVN",
  cefr: "cefr",
  scoresEN: "scoresEN",
  scoresVN: "scoresVN",
  parentID: "parentID",
} as const;

export const OutComeSheetColumns = {
  "Outcome ID": OutComeKeys["outComeId"],
  "CEFR-level": OutComeKeys["cefr"],
  "CEFR Parents ID": OutComeKeys["parentID"],
  "Description (EN)": OutComeKeys["desEN"],
  "Description (VN)": OutComeKeys["desVN"],
  "Scores (EN, Separated by new line)": OutComeKeys["scoresEN"],
  "Scores (VN, Separated by new line)": OutComeKeys["scoresVN"],
};

export type OutCome = {
  [OutComeKeys.outComeId]: string;
  info?: Attribute;
  [OutComeKeys.cefr]?: Cefr;
  meta?: string;
  level1?: Attribute;
  level2?: Attribute;
  level3?: Attribute;
  level4?: Attribute;
  level5?: Attribute;
};

export const mapToOutCome = (value: typeof OutComeKeys): OutCome => {
  const scoresENList = value.scoresEN?.split(REMOVE_LINE_BREAKS_REGEX) || [];
  const scoresVNList = value.scoresVN?.split(REMOVE_LINE_BREAKS_REGEX) || [];

  const result: OutCome = {
    outComeId: value.outComeId?.toLowerCase()?.trim() || "",
    info: {
      en: value.desEN || "",
      vn: value.desVN || "",
    },
    cefr: {
      level: value.cefr?.toLowerCase(),
      parent: value.parentID?.toLowerCase(),
      skill: "",
      system: "",
    },

    level1: {
      en: "",
      vn: "",
    },
    level2: {
      en: "",
      vn: "",
    },
    level3: {
      en: "",
      vn: "",
    },
    level4: {
      en: "",
      vn: "",
    },
    level5: {
      en: "",
      vn: "",
    },
  };

  const allLevel: {
    [key: string]: Attribute;
  } = {};

  if (scoresENList.length > 0)
    for (let i = 0; i < scoresENList.length; i++) {
      allLevel[`level${i + 1}`] = {
        en: scoresENList[i] || "",
        vn: scoresVNList[i] || "",
      };
    }

  return { ...result, ...allLevel };
};
