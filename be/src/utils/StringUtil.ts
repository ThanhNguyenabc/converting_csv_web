const indexToString = (i: number): string => {
  if (i < 10) return `0${i}`;
  return `${i}`;
};

const REMOVE_LINE_BREAKS_REGEX = /\n+/g;
const UPLOAD_PATH = process.env.UPLOAD_PATH
  ? `${process.env.UPLOAD_PATH}/`
  : "";
const OUTCOME_PATH = `${UPLOAD_PATH}uploads/outcomes`;
const LESSON_PATH = `${UPLOAD_PATH}uploads/lessons`;

export { indexToString, REMOVE_LINE_BREAKS_REGEX, LESSON_PATH, OUTCOME_PATH };
