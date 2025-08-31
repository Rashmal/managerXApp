import { AttachmentDetails } from "./attachmentDetails";

export interface ContractStage {
    Id: number;
    Name: string;
    AttachmentList: AttachmentDetails[];
    LastUpdatedDate: Date;
}