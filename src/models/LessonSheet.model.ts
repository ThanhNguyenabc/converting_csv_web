import {
  formatURL,
  addZeroToNum,
  REMOVE_LINE_BREAKS_REGEX,
  WIKI_PREFIX,
} from "utils/StringUtil";
import { Attribute } from "./Attribute.model";
import { Cefr } from "./Cefr.model";

export enum LessonColumn {
  lessonId = "lessonId",
  outComeId0 = "outComeId0",
  outComeId1 = "outComeId1",
  titleEN = "titleEN",
  titleVN = "titleVN",
  cefr = "cefr",
  vocabulary = "vocabulary",
  linkTitle = "linkTitle",
  descTeacherVN = "descTeacherVN",
  descTeacherEN = "descTeacherEN",
  descStudentEN = "descStudentEN",
  descStudentVN = "descStudentVN",
  mainLink = "mainLink",
  projectId = "projectId",
  skills = "skills",
}

export const MappingLessonColum = {
  "Lesson ID (HH-PP-LL-NNN)": LessonColumn["lessonId"],
  "Outcome ID 00": LessonColumn["outComeId0"],
  "Outcome ID 01": LessonColumn["outComeId1"],
  "Title (EN)": LessonColumn["titleEN"],
  "Title (VN)": LessonColumn["titleVN"],
  "CEFR-level": LessonColumn["cefr"],
  "Vocabulary (Separated by ,)": LessonColumn["vocabulary"],
  "Link Title (Separated by new line)": LessonColumn["linkTitle"],
  "Teacher Description": LessonColumn["descTeacherEN"],
  "Main link to resources (Separated by new line)": LessonColumn["mainLink"],
  "Project ID": LessonColumn["projectId"],
  Skills: LessonColumn["skills"],
};

export type Link = Attribute & { url: string };

export type Lesson = {
  [LessonColumn.lessonId]: string;
  title?: Attribute;
  descTeacher?: Attribute;
  descStudent?: Attribute;
  links?: Array<Link>;
  outcomes?: Array<string>;
  [LessonColumn.vocabulary]?: Array<string>;
  [LessonColumn.cefr]?: Cefr;
  [LessonColumn.projectId]?: Attribute & { source?: string };
  [LessonColumn.skills]?: Array<string>;
};

export const generateVocabToList = (str: string) => {
  let vocabularyList: Array<string> = [];
  if (str && str.trim()?.length > 0) {
    vocabularyList = str.split(",");
  }
  return vocabularyList.map((item) => item?.toLowerCase().trim());
};

export const mappToLesson = (data: typeof LessonColumn): Lesson => {
  const outcomes: Array<string> = [];
  const linkList: Array<Link> = [];

  const titles = data.linkTitle?.trim()?.split(REMOVE_LINE_BREAKS_REGEX);
  const links = data.mainLink?.trim()?.split(REMOVE_LINE_BREAKS_REGEX);

  let vocabularyList: Array<string> = generateVocabToList(
    data.vocabulary || ""
  );

  if (titles && titles.length > 0) {
    for (let i = 0; i < titles.length; i++) {
      let url = links[i]?.trim() || "";
      if (url.includes(WIKI_PREFIX)) {
        url = formatURL(links[i]?.trim());
      }
      linkList.push({
        en: titles[i] || "",
        vn: "",
        url: url,
      });
    }
  }

  // outcomes
  if (data.outComeId0) outcomes.push(data.outComeId0);
  if (data.outComeId1) outcomes.push(data.outComeId1);

  return {
    descTeacher: {
      en: data.descTeacherEN || "",
      vn: "",
    },
    descStudent: {
      en: "",
      vn: "",
    },
    links: linkList,
    title: { en: data.titleEN, vn: data.titleVN },
    lessonId: data.lessonId?.toLowerCase()?.trim() || "",
    outcomes,
    cefr: { level: data.cefr?.toLowerCase() || "" },
    vocabulary: vocabularyList,
    projectId:
      data.projectId !== undefined
        ? {
            en: "",
            vn: "",
            source: data.projectId.trim(),
          }
        : undefined,

    skills: data.skills
      .split(",")
      .map((item, index) => `skill ${addZeroToNum(index)} = "${item.trim()}"`),
  };
};
