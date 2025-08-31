export interface Filter {
    SearchQuery: string;
    RecordsPerPage: number;
    CurrentPage: number;
    SortCol: string;
    SortAsc: boolean;
}