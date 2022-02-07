import { LanguageTypeEnum } from "../enums/language-type.enum";

export class SliderModel {
  id?: number;
  type?: LanguageTypeEnum;
  name?: string;
  img?: string;
  createAt?: Date;
}
