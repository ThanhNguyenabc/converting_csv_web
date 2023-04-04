import { Attribute } from "./Attribute.model";

export enum VocabColumn {
  "vocabTerm" = "vocabTerm",
  "infoEN" = "infoEN",
  "infoVN" = "infoVN",
  "level" = "level",
  metatags = "metatags",
  "exampleEN" = "exampleEN",
  "exampleVN" = "exampleVN",
}


export const MappingVocabLMSColumn = {
  "Vocabulary Term": VocabColumn["vocabTerm"],
  en: VocabColumn["infoEN"],
  vn: VocabColumn["infoVN"],
  level: VocabColumn["level"],
  metatags: VocabColumn["metatags"],
  "example en": VocabColumn["exampleEN"],
  "example vn": VocabColumn["exampleVN"],
};
