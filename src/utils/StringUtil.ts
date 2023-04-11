const REMOVE_LINE_BREAKS_REGEX = /[\r\n]+/g;
const UPLOAD_PATH = process.env.UPLOAD_PATH
  ? `${process.env.UPLOAD_PATH}/`
  : "";

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
  formatURL,
  URL_PREFIX,
  WIKI_PREFIX,
  UPLOAD_PATH,
};
