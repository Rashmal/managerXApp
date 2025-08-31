import { TaskDetails } from "./taskDetails";

export interface SubStageCategoryDetails {
    Id: number;
    Name: string;
    StatusName: string;
    StatusCode: string;
    AddedDate: Date;
    TaskDetailsList: TaskDetails[];
    TotalTasks: number;
    TotalCompletedTasks: number;
    TotalRecords: number;
    OverallStatusCode:string;
}