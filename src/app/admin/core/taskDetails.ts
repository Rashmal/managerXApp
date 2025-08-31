import { AttachmentDetails } from "./attachmentDetails";
import { SubTaskDetails } from "./subTaskDetails";
import { SubTaskNote } from "./subTaskNote";
import { UserBasicDetails } from "./userBasicDetails";

export interface TaskDetails {
    Id: number;
    Name: string;
    StatusName: string;
    StatusCode: string;
    Description: string;
    StatusId: number;
    Category: string;
    CategoryId: number;
    SubStageId: number;
    StageId: number;
    DueDate: Date;
    AddedDate: Date;
    PersonList: UserBasicDetails[];
    TotalRecords: number;
    AttachmentList: AttachmentDetails[];
    NoOfFiles: number;
    NoOfImages: number;
    SubTaskDetailsList: SubTaskDetails[];
    SubTaskNoteList: SubTaskNote[];
    SubStageDetailsId: number;
    StageDetailsId: number;
}