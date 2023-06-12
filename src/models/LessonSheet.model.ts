import {
  formatURL,
  indexToString,
  REMOVE_LINE_BREAKS_REGEX,
  WIKI_PREFIX,
} from "utils/StringUtil";
import { Attribute } from "./Attribute.model";
import { Cefr } from "./Cefr.model";

export enum LessonColumn {
  lessonId = "lessonId",
  outComeId = "outComeId",
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
  "Outcome ID": LessonColumn["outComeId"],
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
  [LessonColumn.vocabulary]?: Array<string>;
  [LessonColumn.outComeId]: string;
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
    outComeId: data.outComeId?.toLowerCase()?.trim() || "",
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
      .map((item, index) => `skill ${indexToString(index)} = "${item.trim()}"`),
  };
};
