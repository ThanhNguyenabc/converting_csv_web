const REMOVE_LINE_BREAKS_REGEX = /[\r\n]+/g;
const UPLOAD_PATH = process.env.UPLOAD_PATH
  ? `${process.env.UPLOAD_PATH}/`
  : "";
const OUTCOME_PATH = `${UPLOAD_PATH}uploads/outcomes`;
const LESSON_PATH = `${UPLOAD_PATH}uploads/lessons`;
const VOCAB_PATH = `${UPLOAD_PATH}uploads/vocab`;

const OUTCOME_ZIP = "outcome.zip";
const VOCAB_ZIP = "vocab.zip";
const LESSON_ZIP = "lesson.zip";
const URL_PREFIX = "/services/wikiaccess/?url=";
const WIKI_PREFIX = "ilawiki.ilavietnam.com";

const indexToString = (i: number): string => {
  if (i < 10) return `0${i}`;
  return `${i}`;
};

const formatURL = (url: string): string => {
  return URL_PREFIX.concat(`${encodeURIComponent(url)}`);
};

export {
  indexToString,
  REMOVE_LINE_BREAKS_REGEX,
  LESSON_PATH,
  OUTCOME_PATH,
  VOCAB_PATH,
  OUTCOME_ZIP,
  VOCAB_ZIP,
  LESSON_ZIP,
  formatURL,
  URL_PREFIX,
  WIKI_PREFIX,
};
