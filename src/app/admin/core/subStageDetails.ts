import { SubStageCategoryDetails } from "./subStageCategoryDetails";

export interface SubStageDetails {
    Id: number;
    Name: string;
    StatusName: string;
    StatusCode: string;
    AddedDate: Date;
    TotalRecords: number;
    TotalSubTasks: number;
    SubStageCategoryDetailsList: SubStageCategoryDetails[];
}