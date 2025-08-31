import { ChatMessageFiles } from "./chatMessageFiles";

export interface ChatMessage {
    Id: number;
    Message: string;
    ReadByIdList: string;
    RoomId: number;
    AddedDate: Date;
    SenderId: number;
    SenderName: string;
    SenderAvatar: string;
    ChatFileList: ChatMessageFiles[];
}