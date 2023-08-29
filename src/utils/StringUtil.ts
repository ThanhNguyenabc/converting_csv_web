const REMOVE_LINE_BREAKS_REGEX = /[\r\n]+/g;
const UPLOAD_PATH = "/tmp/";

const URL_PREFIX = "/services/wikiaccess/?url=";
const WIKI_PREFIX = "ilawiki.ilavietnam.com";

const addZeroToNum = (i: number): string => {
  if (i < 10) return `0${i}`;
  return `${i}`;
};

const formatURL = (url: string): string => {
  return URL_PREFIX.concat(`${encodeURIComponent(url)}`);
};

export {
  addZeroToNum,
  REMOVE_LINE_BREAKS_REGEX,
  formatURL,
  URL_PREFIX,
  WIKI_PREFIX,
  UPLOAD_PATH,
};
