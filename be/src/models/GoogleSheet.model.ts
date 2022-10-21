export interface Level {
  [key: string]: string;
}

export interface GoogleSheetData {
  courseLessonId?: string;
  desEN?: string;
  desVN?: string;
  outComeId?: string;
  scoresEN?: Level;
  scoresVN?: Level;
}
