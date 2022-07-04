export interface Page {
    page: number;
    pageSize?: number;
    searchText?: string;
    sortField?: string;
    isSort?: boolean;
}

export interface TypeData<T> {
    data: T[];
    currentPage: number;
    pageSize: number;
    nextStt: number;
    totalItems: number;
}
