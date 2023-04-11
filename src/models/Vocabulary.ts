import { Attribute } from "./Attribute.model";

export enum VocabKeys {
  "vocabTerm" = "vocabTerm",
  "infoEN" = "infoEN",
  "infoVN" = "infoVN",
  "level" = "level",
  metatags = "metatags",
  "exampleEN" = "exampleEN",
  "exampleVN" = "exampleVN",
}

export const VocabLMSColumns = {
  "Vocabulary Term": VocabKeys["vocabTerm"],
  en: VocabKeys["infoEN"],
  vn: VocabKeys["infoVN"],
  level: VocabKeys["level"],
  metatags: VocabKeys["metatags"],
  "example en": VocabKeys["exampleEN"],
  "example vn": VocabKeys["exampleVN"],
};
