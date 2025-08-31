import { AttachmentDetails } from "../../admin/core/attachmentDetails";
import { SubTaskDetails } from "../../admin/core/subTaskDetails";
import { SubTaskNote } from "../../admin/core/subTaskNote";
import { UserBasicDetails } from "../../admin/core/userBasicDetails";

export interface AssignedTaskMoreDetails {
    Id: number;
    Name: string;
    StatusName: string;
    StatusCode: string;
    Description: string;
    StatusId: number;
    ConstructionCompany: string;
    FullAddress: string;
    Category: string;
    SubStageName: string;
    DueDate: Date;
    AddedDate: Date;
    PersonList: UserBasicDetails[];
    TotalRecords: number;
    AttachmentList: AttachmentDetails[];
    NoOfFiles: number;
    NoOfImages: number;
    SubTaskDetailsList: SubTaskDetails[];
    SubTaskNoteList: SubTaskNote[];
    CreatorId: number;
}