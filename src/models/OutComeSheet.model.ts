import { REMOVE_LINE_BREAKS_REGEX } from "utils/StringUtil";
import { Attribute } from "./Attribute.model";
import { Cefr } from "./Cefr.model";

export enum OutComeColumn {
  outComeId = "outComeId",
  desEN = "desEN",
  desVN = "desVN",
  cefr = "cefr",
  scoresEN = "scoresEN",
  scoresVN = "scoresVN",
}

export const MappingOutComeColum = {
  "Outcome ID": OutComeColumn["outComeId"],
  "Description (EN)": OutComeColumn["desEN"],
  "Description (VN)": OutComeColumn["desVN"],
  "CEFR-level": OutComeColumn["cefr"],
  "Scores (EN, Separated by new line)": OutComeColumn["scoresEN"],
  "Scores (VN, Separated by new line)": OutComeColumn["scoresVN"],
};

export type OutCome = {
  [OutComeColumn.outComeId]: string;
  info?: Attribute;
  [OutComeColumn.cefr]?: Cefr;
  meta?: string;
  level1?: Attribute;
  level2?: Attribute;
  level3?: Attribute;
  level4?: Attribute;
  level5?: Attribute;
};

export const mapToOutCome = (value: typeof OutComeColumn): OutCome => {
  const scoresENList = value.scoresEN?.split(REMOVE_LINE_BREAKS_REGEX) || [];
  const scoresVNList = value.scoresVN?.split(REMOVE_LINE_BREAKS_REGEX) || [];

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

  const result: OutCome = {
    outComeId: value.outComeId?.toLowerCase()?.trim() || "",
    info: {
      en: value.desEN || "",
      vn: value.desVN || "",
    },
    cefr: {
      level: value.cefr?.toLowerCase(),
    },
    ...allLevel,
  };

  return result;
};
