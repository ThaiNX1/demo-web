import {LanguageType} from "../../utilities/app-enum";

export interface SliderModel {
    id?: number
    type?: LanguageType
    name?: string
    image?: string
    createAt?: Date
}

export interface SliderViewModel {
    id?: number
    type?: LanguageType
    typeName?: string
    name?: string
    image?: string
    imageUrl?: string
    createAt?: Date
}
