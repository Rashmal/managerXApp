import { ChatRoomMembers } from "./chatRoomMembers";

export interface ChatRoom {
    Id: number;
    RoomName: string;
    RoomDescription: string;
    PersonOwnerId: number;
    PersonOwnerName: string;
    PersonOwnerEmail: string;
    ChatRoomTypeId: number;
    ChatRoomTypeCode: string;
    AddedDate: Date;
    ChatRoomMembersList: ChatRoomMembers[];
    TotalRecords: number;
    UnreadCount: number;
}