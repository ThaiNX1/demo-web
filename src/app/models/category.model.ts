export interface Category {
    id: number;
    code: string;
    name: string;
    type: number;
    note: string;
    isDeleted: boolean;
    numberItem: number;
    isPublish: boolean;
    icon: string;
    image: string;
    codeParent: string;
    nameEnglish: string;
    nameKorea: string;
    isEnableDelete: boolean;
}
