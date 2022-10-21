import { Attribute } from "./Attribute.model";

export interface OutCome {
  outComeId?: string;
  info?: Attribute;
  cefr?: string;
  meta?: string;

  level1?: Attribute;
  level2?: Attribute;
  level3?: Attribute;
  level4?: Attribute;
  level5?: Attribute;
}
