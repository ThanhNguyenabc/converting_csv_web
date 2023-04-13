import { indexToString } from "utils/StringUtil";
import { Lesson } from "models/LessonSheet.model";
import { OutCome } from "models/OutComeSheet.model";
import { Attribute } from "models/Attribute.model";
import { VocabKeys } from "models/Vocabulary";
import { CEFRLevel } from "models/CefrLevel.model";

export const outComeTemplate = (outCome: OutCome) => {
  const output: Array<string> = [];
  output.push(
    `[info]\nen = "${outCome.info?.en}"\nvn = "${outCome.info?.vn}"\n`
  );
  output.push(
    `[cefr]\nlevel = "${outCome.cefr?.level}"\nskill = "${outCome.cefr?.skill}"\nsystem = "${outCome.cefr?.system}"\nparent = "${outCome.cefr?.parent}"\n`
  );
  output.push(`[meta]\ntags = "${outCome.meta}"\n`);
  output.push(
    `[lv 1]\nen = "${outCome.level1?.en}"\nvn = "${outCome.level1?.vn}"\n`
  );
  output.push(
    `[lv 2]\nen = "${outCome.level2?.en}"\nvn = "${outCome.level2?.vn}"\n`
  );
  output.push(
    `[lv 3]\nen = "${outCome.level3?.en}"\nvn = "${outCome.level3?.vn}"\n`
  );
  output.push(
    `[lv 4]\nen = "${outCome.level4?.en}"\nvn = "${outCome.level4?.vn}"\n`
  );
  output.push(
    `[lv 5]\nen = "${outCome.level5?.en}"\nvn = "${outCome.level5?.vn}"\n`
  );

  return output.join("\n");
};

export const lessonTemplate = (lesson: Lesson) => {
  const output: Array<string> = [];
  output.push(`[info]\ntype = "standard"\nauthor = "" \n`);

  output.push(
    `[title]\nen = "${lesson.title?.en}"\nvn = "${lesson.title?.vn}"\n`
  );
  output.push(
    `[desc-teacher]\nen = "${lesson.descTeacher?.en}"\nvn = "${lesson.descTeacher?.vn}"\n`
  );
  output.push(
    `[desc-student]\nen = "${lesson.descStudent?.vn}"\nvn = "${lesson.descStudent?.vn}"\n`
  );

  output.push(
    `[cefr]\nlevel = "${lesson.cefr?.level}"\nskill = ""\nsystem = ""\n`
  );

  output.push(`[outcomes]\noutcome 00 = "${lesson.outComeId}"\n`);
  output.push(`[vocabulary]`);

  if (lesson.vocabulary && lesson.vocabulary.length > 0) {
    for (let i = 0; i < lesson.vocabulary.length; i++) {
      const vocab = lesson.vocabulary[i].trim();
      output.push(`term ${indexToString(i)} = "${vocab}"`);
    }
  }

  if (lesson.links && lesson.links.length > 0) {
    for (let i = 0; i < lesson.links.length; i++) {
      const item = lesson.links[i];
      output.push(
        `\n[link ${indexToString(i)}]\nen = "${item.en}"\nvn = "${
          item.vn
        }"\nurl = "${item.url}"`
      );
    }
  }

  if (lesson.projectId) {
    output.push(
      `\n[project]\nen = "${lesson.projectId?.en}"\nvn = "${lesson.projectId?.vn}"\nsource = "${lesson.projectId?.source}"\n`
    );
  }

  return output.join("\n");
};

export const vocabTemplate = (vocab: Attribute) => {
  const output: Array<string> = [];
  output.push(`[info]\nen = "${vocab?.en}"\nvn = "${vocab?.vn}"\n`);
  return output.join("\n");
};

export const vocabV2Template = (vocab: typeof VocabKeys) => {
  const output: Array<string> = [];
  output.push(`[info]\nen = "${vocab?.infoEN}"\nvn = "${vocab?.infoVN}"\n`);
  output.push(`[cefr]\nlevel = "${vocab.level?.toLowerCase()}"\n`);
  output.push(`[meta]\ntags = "${vocab.metatags}"\n`);
  output.push(
    `[example 00]\nen = "${vocab?.exampleEN}"\nvn = "${vocab?.exampleVN}"\n`
  );
  output.push(`[main]\nen = "${vocab?.vocabTerm}"\n`);

  return output.join("\n");
};

export const cefrLevelTemplate = (cefr: CEFRLevel) => {
  const output: Array<string> = [];
  output.push(
    `[info]\nen = "${cefr?.info?.en || ""}"\nvn = "${cefr?.info?.vn || ""}"\n`
  );
  output.push(`[cefr]\nlevel = "${cefr.cefrLevel}"\n`);
  output.push(`[meta]\ntags = "${cefr.meta}"\n`);
  return output.join("\n");
};
