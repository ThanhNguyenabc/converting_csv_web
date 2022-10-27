import { REMOVE_LINE_BREAKS_REGEX } from "utils/StringUtil";
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
}

export const MappingLessonColum = {
  "Lesson ID (HH-PP-LL-NNN)": LessonColumn["lessonId"],
  "Outcome ID": LessonColumn["outComeId"],
  "Title (EN)": LessonColumn["titleEN"],
  "Title (VN)": LessonColumn["titleVN"],
  "CEFR-level": LessonColumn["cefr"],
  "Vocabulary (Separated by ,)": LessonColumn["vocabulary"],
  "Link Title (Separated by new line)": LessonColumn["linkTitle"],
  "Teacher Description": LessonColumn["descStudentEN"],
  "Main link to resources (Separated by new line)": LessonColumn["mainLink"],
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
};

export const mappToLesson = (data: typeof LessonColumn): Lesson => {
  const linkList: Array<Link> = [];
  const titles = data.linkTitle?.trim()?.split(REMOVE_LINE_BREAKS_REGEX);
  const links = data.mainLink?.trim()?.split(REMOVE_LINE_BREAKS_REGEX);

  if (titles && titles.length > 0) {
    for (let i = 0; i < titles.length; i++) {
      linkList.push({
        en: titles[i] || "",
        vn: "",
        url: links[i] || "",
      });
    }
  }

  let vocabularyList: Array<string> = [];
  if (data.vocabulary && data.vocabulary?.trim()?.length > 0) {
    vocabularyList = data.vocabulary.split(",");
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
    lessonId: data.lessonId?.toLowerCase() || "",
    outComeId: data.outComeId?.toLowerCase() || "",
    cefr: { level: data.cefr?.toLowerCase() || "" },
    vocabulary: vocabularyList,
  };
};